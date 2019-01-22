import ProcessService from '@/services/process'

export default function reloadProcess(msg) {
  ProcessService.reload({ id: msg.data.processID })
}
