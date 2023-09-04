import { Html, Head, Main, NextScript } from 'next/document'
import GoogleAdsComponent from '@components/ui/GoogleAdSense.ignore';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <GoogleAdsComponent />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
