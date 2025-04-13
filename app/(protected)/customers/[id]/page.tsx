import React from 'react'

const page = ({params }:{params:any}) => {

  return (
    <div>
      cutomer {params?.id}
    </div>
  )
}

export default page
