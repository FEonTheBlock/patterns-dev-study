import React, { useState } from "react";

const useHover = () => {
  const ref = useRef();
  const [hovering, setHover] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener("mouseenter", () => setHover(true));
      node.addEventListener("mouseleave", () => setHover(false));
    }

    return () => {
      node.removeEventListener("mouseenter", () => setHover(true));
      node.removeEventListener("mouseleave", () => setHover(false));
    };
  }, [])


  return [ref, hovering];
}

const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
    .then(res => res.json())
    .then(data => setData(data));
  }, []);

  return data;
}

// 장점: Hook을 사용하면 컴포넌트 내부에서 동작하는 로직을 관리할 수 있음.
export default function DogImages() {
  const data = useFetch("https://dog.ceo/api/breed/labrador/images/random/6")
  const [ref, hovering] = useHover();

  return (
    <div ref={ref}>
      {hovering && <div id="hover">Hovering!</div>}
      <div id="list">
        {data.message.map((dog, index) => (
          <img src={dog} alt="Dog" key={index} />
        ))}
      </div>
    </div>
  )
}