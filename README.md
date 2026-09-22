# Portfolio Site

정적 HTML/CSS/JS로 만든 개인 포트폴리오 웹사이트입니다.

## 로컬에서 보기

Python이 설치되어 있다면:

```bash
python3 serve.py 8000
```

브라우저에서 http://localhost:8000 접속하세요.

(홈/프로젝트 페이지가 JS 모듈(`type="module"`)을 사용하므로, 파일을 더블클릭해서 여는 대신 반드시 위 방법으로 로컬 서버를 통해 실행해야 합니다. `serve.py`는 캐시를 끈 채로 파일을 서빙해서, 코드를 수정한 뒤 새로고침하면 항상 최신 내용이 바로 보입니다 — 일반 `python3 -m http.server`를 쓰면 브라우저가 이전 버전을 계속 보여줄 수 있습니다.)

## 실제 콘텐츠로 교체하기

1. **이름/연락처**: `index.html`, `info.html`, `project.html`에 있는 "YOUR NAME", "hey@yourmail.com", Instagram 링크를 본인 정보로 수정하세요.
2. **소개 문구**: `index.html`의 `.intro` 문단과 `info.html`의 소개 문단을 수정하세요.
3. **프로젝트 콘텐츠**: `js/data.js`의 `PROJECTS` 배열에서 각 프로젝트의 `title`, `category`, `thumb`, `hero`, `role`, `year`, `description`, `media`를 실제 내용으로 교체하세요.
   - 이미지/GIF 파일은 원하는 폴더(예: `images/`)에 넣고 `thumb`, `hero`, `media[].src`에 그 경로를 지정하면 됩니다.
   - 영상 파일을 넣으려면 해당 `media` 항목의 `type`을 `"video"`로 지정하세요. GIF와 이미지는 `type: "image"`를 그대로 사용합니다.
4. 프로젝트를 추가하거나 삭제하려면 `PROJECTS` 배열에 항목을 추가/삭제하면 홈 화면 그리드와 상세 페이지에 자동으로 반영됩니다.
