// https://umijs.org/config/

import { join } from 'node:path';
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

import routes from './routes';

const { UMI_ENV = 'dev' } = process.env;

/**
 * @name 雿輻?砍頝臬?
 * @description ?函蔡?嗥?頝臬?嚗??蝵脣??桀?銝??閬?蝵株?銝芸??? * @doc https://umijs.org/docs/api/config#publicpath
 */
const PUBLIC_PATH: string =
  process.env.PUBLIC_PATH || '/project-command-center/';

export default defineConfig({
  /**
   * @name 撘??hash 璅∪?
   * @description 霈?build 銋??漣?拙???hash ???虜?其?憓??????閫?蝸蝻???   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  publicPath: PUBLIC_PATH,
  base: '/project-command-center',

  /**
   * @name ?澆捆?扯挽蝵?   * @description 霈曄蔭 ie11 銝?摰?蝢摰對??閬??亥撌曹蝙?函????韏?   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @name 頝舐??蝵殷?銝頝舐銝剖??亦??辣銝?蝻?
   * @description ?芣??path嚗omponent嚗outes嚗edirect嚗rappers嚗itle ??蝵?   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @name 銝駁???蝵?   * @description ?賜?思蜓憸?雿?嗅??芣 less ???挽蝵?   * @doc antd?蜓憸挽蝵?https://ant.design/docs/react/customize-theme-cn
   * @doc umi ??theme ?蔭 https://umijs.org/docs/api/config#theme
   */
  // theme: { '@primary-color': '#1DA57A' }
  /**
   * @name moment ????蔭
   * @description 憒?撖孵??瘝⊥?閬?嚗?撘銋??賢?撠s??憭批?
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @name 隞???蔭
   * @description ?臭誑霈拐???唳??∪隞???唬????∪銝?餈雿停?臭誑霈輸??函??唳鈭?   * @see 閬釣?誑銝?隞???芾?冽?啣??雿輻嚗uild 銋?撠望?瘜蝙?其???   * @doc 隞??隞? https://umijs.org/docs/guides/proxy
   * @doc 隞???蔭 https://umijs.org/docs/api/config#proxy
   */
  proxy: proxy[UMI_ENV as keyof typeof proxy],
  /**
   * @name 敹恍?湔?蔭
   * @description 銝銝芯????剜?啁?隞塚??湔?嗅隞乩???state
   */
  fastRefresh: true,
  //============== 隞乩??賣max??隞園?蝵?===============
  /**
   * @name ?唳瘚?隞?   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * 銝銝芸撅??憪?格?嚗隞亦摰?辣銋?曹澈?唳
   * @description ?臭誑?冽摮銝鈭撅??殷?瘥??冽靽⊥嚗???鈭撅????典????嗆?港葵 Umi 憿寧??撘憪?撱箝?   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name layout ?辣
   * @doc https://umijs.org/docs/max/layout-menu
   */
  title: 'Ant Design Pro',
  layout: {
    locale: true,
    ...defaultSettings,
  },
  /**
   * @name moment2dayjs ?辣
   * @description 撠★?桐葉??moment ?踵銝?dayjs
   * @doc https://umijs.org/docs/max/moment2dayjs
   */
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  /**
   * @name ?賡???隞?   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  /**
   * @name antd ?辣
   * @description ?蔭鈭?babel import ?辣
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {
    appConfig: {},
    configProvider: {
      theme: {
        token: {
          fontFamily: 'AlibabaSans, sans-serif',
        },
      },
    },
  },
  /**
   * @name 蝵?霂瑟??蔭
   * @description 摰鈭?axios ??ahooks ??useRequest ??鈭?憟?銝??蝏窈瘙??秤憭??寞???   * @doc https://umijs.org/docs/max/request
   */
  request: {},
  /**
   * @name ???辣
   * @description ?箔? initialState ????隞塚?敹◆??撘 initialState
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name <head> 銝剝?憭? script
   * @description ?蔭 <head> 銝剝?憭? script
   */
  headScripts: [
    // 閫?擐活?蝸?嗥撅??桅?
    { src: join(PUBLIC_PATH, 'scripts/loading.js'), async: true },
  ],
  //================ pro ?辣?蔭 =================
  presets: ['umi-presets-pro'],
  /**
   * @name openAPI ?辣??蝵?   * @description ?箔? openapi ?????erve ?ock嚗??敺??瑟隞??
   * @doc https://pro.ant.design/zh-cn/docs/openapi/
   */
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      // ?蝙?典蝥輻??
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath:
        'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  mock: {
    include: ['mock/**/*', 'src/pages/**/_mock.ts'],
  },
  // Disable utoopack on this Windows environment; use default bundler instead.
  utoopack: false,
  requestRecord: {},
  exportStatic: {},
  esbuildMinifyIIFE: true,
  define: {
    'process.env.CI': process.env.CI,
  },
});
