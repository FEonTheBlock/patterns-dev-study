const useCondition = (condition: boolean) => {
  return <T extends Callback<T>>(
    callback: T,
    options: Options<T> = {
      fallback: () => {},
    }
  ) => {
    return (props: ExtractProps<T>): ReturnType<T> => {
      if (!condition) {
        return options.fallback?.(props);
      }
      return callback(props);
    };
  };
};

const useAuthCondition = () => {
  const { push } = useRouter();
  const status = useRecoilValue(loginStatus);
  const withAuth = useCondition(status === 'authenticated');

  return <T extends Callback<T>>(callback: T, options?: Options<T>) => {
    const fallback = () => {
      push('/signin');
    };

    return withAuth(callback, { fallback: options?.fallback ?? fallback });
  };
};
