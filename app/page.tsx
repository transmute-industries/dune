

import dynamic from 'next/dynamic'

const RapiDocReact = dynamic(() => import('../components/RapiDocReact'), {
    ssr: false
})

export default function Home() {
  return (
    <RapiDocReact spec-url='openapi.yml' show-header={false} />
  )
}
