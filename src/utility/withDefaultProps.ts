import { ComponentType } from "react";

export const withDefaultProps = <Props extends object, DefaultProps extends Partial<Props> = Partial<Props>>(
  defaultProps: DefaultProps,
  component: ComponentType<Props>,
) => {
  type PropsExcludingDefaults = Pick<Props, Exclude<keyof Props, keyof DefaultProps>>;
  type PropsWithOptionalDefaults = Partial<DefaultProps> & PropsExcludingDefaults;
  component.defaultProps = defaultProps;

  return component as ComponentType<PropsWithOptionalDefaults>;
};
