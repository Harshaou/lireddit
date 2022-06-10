import { ChakraProvider } from '@chakra-ui/react'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { cacheExchange, QueryInput, Cache } from '@urql/exchange-graphcache';
import theme from '../theme'
import { AppProps } from 'next/app'
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from '../generated/graphql';



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme} > 
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
