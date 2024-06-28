https://stackoverflow.com/questions/59823922/change-modal-button-texts-in-ant-design


**Initial Steps to setup antd**

-   Install antdpackage

        npm install antd nextjs-toploader @ant-design/nextjs-registry  @ant-design/icons


-   theme configurations

        -   Create a file `/app/theme/themeConfig`

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
        import NextTopLoader from 'nextjs-toploader';


        // Page Loader
const LOADER = () => {
  return (
    <>
      <NextTopLoader
        color="#9fef00"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #9fef00,0 0 5px #9fef00"
      />
    </>
  )
}



        <body className={inter.className + " bg-color-dark m-0 flex min-h-screen max-w-screen flex-col overflow-x-hidden"}>
        <LOADER />
          <AntdRegistry>
            <ConfigProvider theme={theme}>
                <main className="relative z-10 flex flex-1 flex-col">
                  {children}
                </main>
            </ConfigProvider>
          </AntdRegistry>
      </body>

        ```