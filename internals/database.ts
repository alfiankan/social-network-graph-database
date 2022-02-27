import { driver, auth, Session } from 'neo4j-driver'

function createSession(): Session {
    // neo4j+s://41343303.databases.neo4j.io
    const drv = driver(
        'neo4j+s://41343303.databases.neo4j.io',
        auth.basic('neo4j', '2pl6ywMKEMLzgDQBBPJR3jShgM5yxtU3qZcwIO3yzhE')
    )
      
    // drv.verifyConnectivity().then(response => console.log(response))
      
    return drv.session()
}

export {createSession}