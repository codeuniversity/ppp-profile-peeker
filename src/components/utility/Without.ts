export type Without<Type, Properties> = Pick<Type, Exclude<keyof Type, Properties>>;

export default Without;
