import tkinter as tk
from tkinter import filedialog, messagebox
import face_recognition
import json
import os
import numpy as np
import cv2
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image, ImageTk, ImageFont, ImageDraw
from ultralytics import YOLO  # YOLO 모델을 import 해야 합니다.

# 데이터 저장 경로
ENCODINGS_FILE = "registered_face/face_encodings.json"

# YOLO 모델 로드 (전역 변수로 설정)
model = YOLO('/Users/muru/Documents/KDT3/KDT_Project_3/face_epoch70_results/face_epoch70.pt')

# 설정
THRESHOLD = 0.95
FRAME_THRESHOLD = 10  # 얼굴이 타원 안에 있는지 확인할 프레임 수

def load_encodings():
    """기존 임베딩을 JSON 파일에서 로드합니다."""
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

def save_encodings(encodings):
    """임베딩 데이터를 JSON 파일에 저장합니다."""
    with open(ENCODINGS_FILE, "w") as f:
        json.dump(encodings, f)

def register_face(name, image_path):
    """새로운 사용자의 얼굴을 등록합니다."""
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        print("얼굴을 인식할 수 없습니다.")
        return

    new_encoding = encodings[0].tolist()  # NumPy 배열을 리스트로 변환
    encodings_dict = load_encodings()

    if name in encodings_dict:
        encodings_dict[name].append(new_encoding)
    else:
        encodings_dict[name] = [new_encoding]

    save_encodings(encodings_dict)
    print(f"{name}의 얼굴이 등록되었습니다.")

def open_file_dialog():
    """파일 다이얼로그를 열어 이미지 파일을 선택합니다."""
    file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.jpg;*.jpeg;*.png")])
    if file_path:
        name = name_entry.get().strip()  # 입력된 사용자 이름 가져오기
        if name:
            register_face(name, file_path)
            messagebox.showinfo("등록 완료", f"{name}의 얼굴이 등록되었습니다.")
        else:
            messagebox.showwarning("입력 오류", "사용자 이름을 입력해주세요.")
    else:
        messagebox.showwarning("파일 선택 오류", "파일을 선택하지 않았습니다.")

def recognize_faces():
    """웹캠을 사용하여 얼굴 인식을 시작합니다."""
    registered_faces = load_encodings()
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("웹캠을 열 수 없습니다.")
        return

    def extract_embedding(face_image):
        """얼굴 임베딩 추출"""
        rgb_face = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)
        face_encodings = face_recognition.face_encodings(rgb_face)
        if face_encodings:
            return np.array(face_encodings[0])
        return np.zeros(128)

    def draw_text_centered_above_ellipse(img, text, center_x, center_y, radius_y, font_size=20, color=(0, 255, 0)):
        """타원 위에 텍스트를 중앙 정렬로 그리기"""
        pil_img = Image.fromarray(img)
        draw = ImageDraw.Draw(pil_img)
        font_path = "/Users/muru/Library/Fonts/D2CodingBold-Ver1.3.2-20180524.ttf"
        font = ImageFont.truetype(font_path, font_size)

        # textbbox를 사용하여 텍스트 크기 계산
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # 타원 위에 텍스트를 위치시키기 위한 좌표 계산
        position = (center_x - text_width // 2, center_y - radius_y - text_height - 10)

        draw.text(position, text, font=font, fill=color)
        return np.array(pil_img)

    frames_in_ellipse = 0
    face_recognized = False
    ellipse_color = (255, 0, 0)  # 초기 타원 테두리 색상 (파랑)
    message = "얼굴을 원 안에 맞춰주세요"

    while True:
        ret, frame = cap.read()
        if not ret:
            print("프레임을 가져올 수 없습니다.")
            break

        frame = cv2.flip(frame, 1)
        results = model(frame)

        # 타원의 중심과 반지름 설정 (세로로 긴 타원)
        center_x, center_y = frame.shape[1] // 2, frame.shape[0] // 2
        radius_x = int(min(center_x, center_y) * 0.6)  # 가로 반지름
        radius_y = int(min(center_x, center_y) * 0.8)  # 세로 반지름

        # 타원 그리기
        cv2.ellipse(frame, (center_x, center_y), (radius_x, radius_y), 0, 0, 360, ellipse_color, 2)

        face_in_ellipse = False
        for result in results:
            if result.boxes:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    face = frame[y1:y2, x1:x2]
                    face_embedding = extract_embedding(face)

                    # 타원 안에 얼굴이 있는지 확인
                    if x1 >= center_x - radius_x and x2 <= center_x + radius_x and y1 >= center_y - radius_y and y2 <= center_y + radius_y:
                        face_in_ellipse = True
                        if not registered_faces:
                            face_recognized = False
                        else:
                            similarities = []
                            for name, embeddings in registered_faces.items():
                                for embedding in embeddings:
                                    sim = cosine_similarity([face_embedding], [embedding])[0][0]
                                    similarities.append((name, sim))

                            if similarities:
                                best_match = max(similarities, key=lambda x: x[1])
                                if best_match[1] > THRESHOLD:
                                    face_recognized = True
                                else:
                                    face_recognized = False
                            else:
                                face_recognized = False

        if face_in_ellipse and face_recognized:
            frames_in_ellipse += 1
        else:
            frames_in_ellipse = 0

        if frames_in_ellipse >= FRAME_THRESHOLD:
            ellipse_color = (0, 255, 0)  # 초록색
            message = "출입 허용되었습니다"
            text_color = (0, 255, 0)  # 초록색 글자
        else:
            ellipse_color = (255, 0, 0)  # 파란색
            message = "얼굴을 원 안에 맞춰주세요"
            text_color = (255, 0, 0)  # 파란색 글자

        # 타원 위에 문구 표시 (가운데 정렬)
        frame = draw_text_centered_above_ellipse(frame, message, center_x, center_y, radius_y, font_size=30, color=text_color)

        cv2.imshow("YOLO Face Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def start_recognition():
    """인식 버튼 클릭 시 얼굴 인식 시작"""
    recognize_faces()

# GUI 생성
root = tk.Tk()
root.title("얼굴 등록 및 인식")

# 사용자 이름 입력
name_label = tk.Label(root, text="사용자 이름:")
name_label.pack(pady=5)
name_entry = tk.Entry(root)
name_entry.pack(pady=5)

# 얼굴 등록 버튼
register_button = tk.Button(root, text="얼굴 등록", command=open_file_dialog)
register_button.pack(pady=10)

# 얼굴 인식 버튼
recognize_button = tk.Button(root, text="얼굴 인식", command=start_recognition)
recognize_button.pack(pady=10)

root.mainloop()