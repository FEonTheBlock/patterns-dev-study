## replaceState 함수 Proxy 객체로 override

- 이전에 전역 상태 대신, history 이벤트로 url query 가 변경된 걸 다른 컴포넌트에 감지시킬 방법을 찾다가 해당 함수를 생성하게 되었음
- 다만 replaceState를 호출할 경우, 이를 감지할 수 있는 Window 이벤트가 없어 Custom 이벤트로 보내야 했음. 기본 window.history.replaceState 함수롤 Override 해서 기본 동작안에 custom 이벤트를 보내도록 하여 구현함.
