const replace = (url) => {
  window.history.replaceState = new Proxy(window.history.replaceState, {
    apply: (target, thisArg, [data, unused, url]) => {
      window.dispatchEvent(
        new CustomEvent() <
          CustomEventParams >
          ('replaceState',
          {
            detail: { url, origin },
          })
      );
      return target.apply(thisArg, [data, unused, url]);
    },
  });
  window.history.replaceState(null, '', url);
};
