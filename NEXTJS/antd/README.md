https://stackoverflow.com/questions/59823922/change-modal-button-texts-in-ant-design


**Initial Steps to setup antd**

-   Install antdpackage

        npm install antd nextjs-toploader @ant-design/nextjs-registry  @ant-design/icons


-   theme configurations

        -   Create a file `/app/theme/themeConfig.tsx`

```
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  // token: {
  //   fontSize: 16,
  //   colorPrimary: '#52c41a',
  // },
};

export default theme;

```


        -   Update layout.tsx

        ```

        import theme from './theme/themeConfig';
        import { ConfigProvider } from 'antd';
        import { AntdRegistry } from '@ant-design/nextjs-registry';
        





        <body className={inter.className }>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
                <main >
                  {children}
                </main>
            </ConfigProvider>
          </AntdRegistry>
      </body>

        ```