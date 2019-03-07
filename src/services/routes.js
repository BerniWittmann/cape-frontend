import { getDeep } from '@/utils/helpers'

const routes = {
  processes: {
    all: '/processes',
    single: '/processes/<id>',
    tags: '/processes/<id>/tags',
    reserve: '/processes/<id>/reserve'
  },
  context_factors: {
    all: '/context_factors',
    single: '/context_factors/<id>'
  },
  context_situations: {
    all: '/context_situations',
    single: '/context_situations/<id>'
  },
  context_types: {
    all: '/context_types',
    single: '/context_types/<id>'
  },
  tags: {
    all: '/tags',
    single: '/tags/<id>'
  },
  injection_mappings: {
    all: '/injection_mappings',
    single: '/injection_mappings/<id>'
  }
}

export default function getRoute(name, overrides = []) {
  let path = getDeep(routes, name)
  for (let i = 0; i < overrides.length; i++) {
    let val = overrides[i]
    val = (val && val.id) ? val.id : val
    path = path.replace('<id>', val)
  }
  return path
}
