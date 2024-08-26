import cv2
from ultralytics import YOLO

# 모델 로드
model = YOLO('/Users/muru/Documents/KDT3/KDT_Project_3/face_epoch70_results/face_epoch70.pt')  # 학습된 모델 경로

# 웹캠 사용 설정 (0은 기본 웹캠, 1은 다른 외부 장치)
cap = cv2.VideoCapture(1)

if not cap.isOpened():
    print("웹캠을 열 수 없습니다.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("프레임을 가져올 수 없습니다.")
        break

    # 모델을 사용하여 객체 감지 수행
    results = model(frame)

    # 탐지된 얼굴 영역에 블러(모자이크) 처리
    for box in results[0].boxes:
        # 바운딩 박스 좌표 가져오기
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        # 탐지된 얼굴 영역 잘라내기
        face = frame[y1:y2, x1:x2]

        # 얼굴 영역에 모자이크 처리 (블러 적용)
        face = cv2.resize(face, (25, 25), interpolation=cv2.INTER_LINEAR)  # 작은 크기로 리사이즈
        face = cv2.resize(face, (x2 - x1, y2 - y1), interpolation=cv2.INTER_NEAREST)  # 원래 크기로 리사이즈

        # 블러 처리된 얼굴 영역을 원본 프레임에 다시 삽입
        frame[y1:y2, x1:x2] = face

    # 결과를 화면에 표시
    cv2.imshow('YOLO Detection with Blurred Faces', frame)

    # 'q' 키를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 웹캠과 창 해제
cap.release()
cv2.destroyAllWindows()