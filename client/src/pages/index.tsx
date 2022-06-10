import { withUrqlClient } from 'next-urql'
import React from 'react'
import { NavBar } from '../components/NavBar'
import { usePostsQuery } from '../generated/graphql'
import {createUrqlClient} from '../utils/createUrqlClient'

const index = () => {
  const [{data}] = usePostsQuery()

  console.log(data)
  return (
    <>
      <NavBar />
      <div>index</div>
      {!data ? <p>Loading....</p>:  data.posts.map(item => <p key={item.title}>{item.title}</p>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(index) 