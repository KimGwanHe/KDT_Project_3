import cv2
from ultralytics import YOLO

# 얼굴 탐지 모델 로드
face_model = YOLO('/Users/muru/Documents/KDT3/KDT_Project_3/face_epoch70_results/face_epoch70.pt')

# 차 번호판 탐지 모델 로드
plate_model = YOLO('/Users/muru/Documents/KDT3/KDT_Project_3/car_epoch50_results/car_epoch50.pt')

# 웹캠 사용 설정 (0은 기본 웹캠, 1은 외부 장치)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("웹캠을 열 수 없습니다.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("프레임을 가져올 수 없습니다.")
        break

    # 웹캠 좌우 반전
    frame = cv2.flip(frame, 1)  # 1은 좌우 반전, 0은 상하 반전

    # 얼굴 감지 수행
    face_results = face_model(frame)

    # 번호판 감지 수행
    plate_results = plate_model(frame)

    # 얼굴이 감지되었을 때만 처리
    if face_results[0].boxes:
        # 바운딩 박스 중 가장 큰 크기를 가진 얼굴 찾기
        largest_box = None
        largest_area = 0

        for box in face_results[0].boxes:
            # 바운딩 박스 좌표 가져오기
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            area = (x2 - x1) * (y2 - y1)  # 바운딩 박스 면적 계산

            if area > largest_area:
                largest_area = area
                largest_box = (x1, y1, x2, y2)

        # 가장 큰 얼굴을 제외한 나머지 얼굴에 블러 처리
        for box in face_results[0].boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # 가장 큰 얼굴은 블러 처리 제외
            if (x1, y1, x2, y2) == largest_box:
                continue

            # 얼굴 영역 잘라내기
            face = frame[y1:y2, x1:x2]

            # 얼굴 영역에 모자이크 처리 (블러 적용)
            face = cv2.resize(face, (25, 25), interpolation=cv2.INTER_LINEAR)  # 작은 크기로 리사이즈
            face = cv2.resize(face, (x2 - x1, y2 - y1), interpolation=cv2.INTER_NEAREST)  # 원래 크기로 리사이즈

            # 블러 처리된 얼굴 영역을 원본 프레임에 다시 삽입
            frame[y1:y2, x1:x2] = face

    # 번호판 감지된 부분에 블러 처리
    if plate_results[0].boxes:
        for box in plate_results[0].boxes:
            # 바운딩 박스 좌표 가져오기
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # 번호판 영역 잘라내기
            plate = frame[y1:y2, x1:x2]

            # 번호판 영역에 모자이크 처리 (블러 적용)
            plate = cv2.resize(plate, (25, 25), interpolation=cv2.INTER_LINEAR)  # 작은 크기로 리사이즈
            plate = cv2.resize(plate, (x2 - x1, y2 - y1), interpolation=cv2.INTER_NEAREST)  # 원래 크기로 리사이즈

            # 블러 처리된 번호판 영역을 원본 프레임에 다시 삽입
            frame[y1:y2, x1:x2] = plate

    # 결과를 화면에 표시
    cv2.imshow('YOLO Detection with Blurred Faces and License Plates', frame)

    # 'q' 키를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 웹캠과 창 해제
cap.release()
cv2.destroyAllWindows()