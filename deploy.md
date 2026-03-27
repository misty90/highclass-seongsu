# 하이클래스 부동산 웹사이트 배포 가이드

본 프로젝트는 React (Vite) 기반으로 제작된 Single Page Application (SPA) 입니다.
FastComet과 같은 cPanel 기반 호스팅 환경에 정적 파일로 배포할 수 있습니다.

## 1. 빌드 (정적 파일 생성)

로컬 환경에서 다음 명령어를 실행하여 배포용 정적 파일을 생성합니다.

```bash
npm run build
```

명령어 실행이 완료되면 프로젝트 루트 디렉토리에 `dist` 폴더가 생성됩니다.
이 `dist` 폴더 안의 모든 파일과 폴더가 실제 서버에 업로드할 파일들입니다.

## 2. FastComet (cPanel) 배포 방법

### 방법 A: cPanel 파일 매니저 사용 (권장)

1. `dist` 폴더 안의 **모든 파일과 폴더**를 선택한 후 하나의 `.zip` 파일로 압축합니다. (예: `deploy.zip`)
2. FastComet cPanel에 로그인합니다.
3. **File Manager (파일 매니저)** 를 엽니다.
4. 서브도메인(`seongsu.hnchouse.com`)이 연결된 루트 디렉토리로 이동합니다. (보통 `public_html/seongsu` 또는 설정한 폴더)
5. 상단의 **Upload (업로드)** 버튼을 클릭하고 앞서 만든 `deploy.zip` 파일을 업로드합니다.
6. 업로드가 완료되면 파일 매니저로 돌아와 `deploy.zip` 파일을 우클릭하고 **Extract (압축 풀기)** 를 선택합니다.
7. 압축이 풀리면 `index.html`, `assets/` 폴더 등이 해당 디렉토리에 위치하는지 확인합니다.
8. (선택사항) 업로드한 `deploy.zip` 파일은 삭제해도 됩니다.

### 방법 B: FTP 클라이언트 사용 (FileZilla 등)

1. FTP 클라이언트(FileZilla, Cyberduck 등)를 실행합니다.
2. FastComet FTP 계정 정보로 서버에 접속합니다.
3. 서브도메인(`seongsu.hnchouse.com`)이 연결된 디렉토리로 이동합니다.
4. 로컬 컴퓨터의 `dist` 폴더 **안에 있는 모든 파일과 폴더**를 선택하여 서버 디렉토리로 드래그 앤 드롭(업로드) 합니다.

## 3. 라우팅 설정 (중요: .htaccess)

React SPA는 클라이언트 사이드 라우팅을 사용하므로, 사용자가 직접 하위 URL(예: `seongsu.hnchouse.com/complex/galleria`)로 접속하거나 새로고침할 때 404 에러가 발생할 수 있습니다.
이를 방지하기 위해 서버 루트 디렉토리에 `.htaccess` 파일을 생성하고 다음 내용을 추가해야 합니다.

cPanel 파일 매니저에서 숨김 파일 표시 설정을 켜고, `.htaccess` 파일이 없다면 새로 생성하여 아래 코드를 붙여넣습니다.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 4. 데이터 관리 안내

본 웹사이트는 별도의 백엔드 서버 없이 브라우저의 IndexedDB(로컬 스토리지)를 사용하여 데이터를 관리하도록 설계되었습니다.
따라서 관리자 페이지에서 등록한 매물이나 단지 정보는 **현재 작업 중인 브라우저에만 저장**됩니다.

실제 운영 환경에서 여러 기기나 관리자가 데이터를 공유하려면 Firebase, Supabase 등의 BaaS(Backend as a Service) 연동이 필요합니다. 현재 버전은 UI/UX 확인 및 단일 기기 운영을 위한 데모/초기 버전입니다.

문의 폼은 Formspree(`https://formspree.io/f/mzdkbjwo`)와 연동되어 있어 정상적으로 이메일 수신이 가능합니다.
