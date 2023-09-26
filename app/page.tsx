
import RapiDocReact from '../components/RapiDocReact'

export default function Home() {
  return (
    <RapiDocReact spec-url='openapi.yml' show-header={false} />
  )
}
