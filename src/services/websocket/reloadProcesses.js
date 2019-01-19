import ProcessService from '@/services/process'

export default function reloadProcesses() {
  ProcessService.getAll()
}
