interface BuildWrapperResult<T> {
  build: (props?: any) => Promise<T>;
  instantiate: (props?: any) => T;
}

export const buildWrapper = <T>(factory: any): BuildWrapperResult<T> => {
  const build = async (options = {}): Promise<T> => {
    const instance = factory.build(options);
    await instance.save();
    return instance;
  };
  const instantiate = (options = {}): T => {
    return factory.build(options);
  };
  return { build, instantiate };
};
