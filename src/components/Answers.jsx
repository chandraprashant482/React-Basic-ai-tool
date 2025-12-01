import React, { useEffect, useState } from 'react'
import { checkHeading, replaceHeadingStar } from '../files/helper';

const Answers = ({ans,key,type}) => {
    
    const [heading, setheading] = useState(false)

    const [answer, setanswer] = useState(ans)
    useEffect(() => {
      if(checkHeading(ans)){
        setheading(true)
        setanswer(replaceHeadingStar(ans))
      }
    }, [])
    
  return (
    <>
    {
        key==0? <span className='pt-2 block text-xl text-white'>{answer}</span>:
        heading?<span className='pt-2 block text-lg text-white'>
        {answer}
    </span>:
    <span className={type=='q'?'pl-1':'pl-5'}>{answer}</span>
    }
    
    </>
  )
}

export default Answers