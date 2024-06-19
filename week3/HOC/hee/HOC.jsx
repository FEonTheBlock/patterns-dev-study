import React, { useState } from "react";

function withHover(Element) {
  return props => {
    const [hovering, setHover] = useState(false);

    // 문제점1.
    // 만약 DogImages 컴포넌트 내부에서 이벤트 핸들러를 다시 할당한다면 HOC로 넣어준 이벤트 핸들러가 덮어씌워진다.
    // 때문에 덮어 씌어진 경우 어디서 문제가 발생했는지 찾기가 어렵다.
    return (
      <Element
        {...props}
        hovering={hovering}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
    );
  };
}

// 이건 Suspense와 Errorboundrary 를 사용해서 상위 컴포넌트에서 처리 가능하다.
// 훅으로도 대체 가능!!
function withLoader(Element, url) {
  return props => {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

    if (!data) {
      return <div>Loading...</div>;
    }

    return <Element {...props} data={data} />;
  };
}


function DogImages(props) {
  return (
    <div {...props}>
      {/*
        문제점2.
        props로 전달받은 hovering 이라는 값을 어디서 넣어주었는지 찾기 어려우며
        다른 props들과 관심사의 분리가 어렵다.
        컴포넌트의 크기가 커지게 되면 많은 props들을 내려받기 때문에 관심사의 분리가 꼭 필요하다.
      */}
      {props.hovering && <div id="hover">Hovering!</div>}
      <div id="list">
        {props.data.message.map((dog, index) => (
          <img src={dog} alt="Dog" key={index} />
        ))}
      </div>
    </div>
  );
}

export default withHover(
  withLoader(DogImages, "https://dog.ceo/api/breed/labrador/images/random/6")
);
