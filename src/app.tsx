import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import React from 'react';
import Footer from '@/components/Footer';
import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: false,
    avatarProps: false,
    waterMarkProps: false,
    footerRender: () => <Footer />,
    bgLayoutImgList: [],
    menuHeaderRender: false,
    menuFooterRender: false,
    menuExtraRender: false,
    headerTitleRender: (_, title) => title,
    childrenRender: (children) => <>{children}</>,
    ...initialState?.settings,
  };
};
