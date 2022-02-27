import { QueryResult } from 'neo4j-driver'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createSession } from '../../internals/database'
import { UserRepository } from '../../repository/UserRepository'
import styles from '../../styles/Home.module.css'

const Profile: NextPage = () => {

  const router = useRouter()

  const [followers, setFollowers] = useState<QueryResult>()
  const [followersOtherProfile, setFollowersOtherProfile] = useState<QueryResult>()
  const [sosialButton, setSocialButton] = useState<QueryResult>()
  const [followings, setFollowings] = useState<QueryResult>()
  const [followingsOtherProfile, setFollowingssOtherProfile] = useState<QueryResult>()
  const [logedInUser, setLogedInUser] = useState<string | null>()

  const [username, setUsername] = useState<string | string[] | undefined>()

  function getFollower(username: string | string[] | undefined) {
    const userRepo = new UserRepository(createSession())

    userRepo.getUserFollower(username).then(result => { 
      setFollowers(result) 
    }).catch(err => {
      console.log(err)
    })
  }

  function getFollowerOtherProfile(username: string | string[] | undefined) {
    const userRepo = new UserRepository(createSession())

    userRepo.getProfileFollower(username).then(result => { 
      setFollowersOtherProfile(result) 
    }).catch(err => {
      console.log(err)
    })
  }

  function getFollowingsOtherProfile(username: string | string[] | undefined) {
    const userRepo = new UserRepository(createSession())

    userRepo.getProfileFollowing(username).then(result => { 
      setFollowingssOtherProfile(result) 
    }).catch(err => {
      console.log(err)
    })
  }

  function getFollowing(username: string | string[] | undefined) {
    const userRepo = new UserRepository(createSession())
    
    userRepo.getUserFollowing(username).then(result => { 
      setFollowings(result) 
    }).catch(err => {
      console.log(err)
    })
  }

  function follow(username: string | string[] | undefined) {
    console.log('FOLLOW', username)
    const userRepo = new UserRepository(createSession())

    userRepo.follow(logedInUser, username).then((res) => { 
      console.log(res)
      location.reload()
    }).catch((err) => {
      console.log(err)
      location.reload()
    })
  }

  function unfollow(username: string | string[] | undefined) {
    console.log('FUNOLLOW', username)
    const userRepo = new UserRepository(createSession())

    userRepo.unfollow(logedInUser, username).then((res) => { 
      console.log(res)
      location.reload()
    }).catch((err) => {
      console.log(err)
      location.reload()
    })
  }

  function getSosialButtonStatus(username: string | string[] | undefined) {
    const userRepo = new UserRepository(createSession())

    userRepo.sosialFollowButton(logedInUser, username).then((res) => { 
      console.log(res)
      setSocialButton(res)

    }).catch((err) => {
      console.log(err)
    })
  }



  useEffect(() => {
    const { username } = router.query
    setUsername(username)

   
    if (typeof window !== 'undefined') {
      setLogedInUser(localStorage.getItem('logedinas'))
      console.log("FRONT", localStorage.getItem('logedinas'), logedInUser)
      getSosialButtonStatus(username)
      if (localStorage.getItem('logedinas') == username) {
        getFollower(username)
        getFollowing(username)
      } else {
        getFollowerOtherProfile(username)
        getFollowingsOtherProfile(username)
      }
    }

  }, [0])

  // useEffect(() => {
  //   setLogedInUser(localStorage.getItem('logedinas'))
  // }, [username])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 onClick={() => {location.href = '/'}} className={styles.title}>
          MEOW 🐈 PROFILE
        </h1>
        <h5>----------------------------------</h5>
        <h2>@{username}</h2>
        {
          logedInUser != username  ?
          sosialButton?.records[0]?.get('followme') == 1 && sosialButton?.records[0]?.get('followother') == 1?<button onClick={() => {unfollow(username)}} >UNFOLLOW</button>:null
          :null
        }
        {
          logedInUser != username  ?
          sosialButton?.records[0]?.get('followme') == 0 && sosialButton?.records[0]?.get('followother') == 1?<button onClick={() => {unfollow(username)}} >UNFOLLOW</button>:null
          :null
        }
        {
          logedInUser != username  ?
          sosialButton?.records[0]?.get('followme') == 1 && sosialButton?.records[0]?.get('followother') == 0?<button onClick={() => {follow(username)}} >FOLLOW BACK</button>:null
          :null
        }
        {
          logedInUser != username  ?
          sosialButton?.records[0]?.get('followme') == 0 && sosialButton?.records[0]?.get('followother') == 0?<button onClick={() => {follow(username)}} >FOLLOW</button>:null
          :null
        }
        <h5>----------------------------------</h5>
        <h3>Followers</h3>
        <ul>
        {logedInUser == username?
          followers?.records?.map((follower, idx) => follower.get('followingback') == 0 && localStorage.getItem('logedinas') == username?
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${follower.get('follower_username')}`}>{follower.get('follower_username')}</a> <button onClick={() => follow(follower.get('follower_username'))} style={{backgroundColor: 'red', color: 'white'}}>Follow Back</button> </li>):
            (localStorage.getItem('logedinas') == follower.get('follower_username'))?(<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${follower.get('follower_username')}`}>{follower.get('follower_username')}</a> <span style={{color: 'red'}}>[its you]</span> </li>):
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${follower.get('follower_username')}`}>{follower.get('follower_username')}</a> </li>)
          )
          :
          followersOtherProfile?.records?.map((follower, idx) => (localStorage.getItem('logedinas') == follower.get('follower_username'))?
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${follower.get('follower_username')}`}>{follower.get('follower_username')}</a> <span style={{color: 'red'}}>[its you]</span> </li>):
            (follower.get('following') == 0 )?
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${follower.get('follower_username')}`}>{follower.get('follower_username')}</a> <button onClick={() => follow(follower.get('follower_username'))} style={{backgroundColor: 'red', color: 'white'}}>Follow</button> </li>):
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${follower.get('follower_username')}`}>{follower.get('follower_username')}</a> </li>)
          )
        }
        </ul>
        <h5>----------------------------------</h5>
        <h3>Following</h3>
        <ul>
        {logedInUser == username?
          followings?.records?.map((following, idx) => localStorage.getItem('logedinas') == username? 
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${following.get('following_username')}`}>{following.get('following_username')}</a> <button onClick={() => unfollow(following.get('following_username'))} style={{backgroundColor: 'red', color: 'white'}}>Unfollow</button> </li>):
            (localStorage.getItem('logedinas') == following.get('following_username'))?(<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${following.get('following_username')}`}>{following.get('following_username')}</a> <span style={{color: 'red'}}>[its you]</span> </li>):
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${following.get('following_username')}`}>{following.get('following_username')}</a></li>)
          )
          :
          followingsOtherProfile?.records?.map((following, idx) => (localStorage.getItem('logedinas') == following.get('following_username'))?
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${following.get('following_username')}`}>{following.get('following_username')}</a> <span style={{color: 'red'}}>[its you]</span> </li>):
            (following.get('user_following') == 0 )?
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${following.get('following_username')}`}>{following.get('following_username')}</a> <button onClick={() => follow(following.get('following_username'))} style={{backgroundColor: 'red', color: 'white'}}>Follow</button> </li>):
            (<li key={idx}> <a className={styles.linkin} href={`${router.basePath}/profile/${following.get('following_username')}`}>{following.get('following_username')}</a></li>)
          )
        }
        </ul>

      </main>

     
    </div>
  )
}

export const getServerSideProps = async (context: { query: { username: any } }) => {
  const username = context.query.username;  
  return {
    props: {
      username
    }
  };
};

export default Profile
