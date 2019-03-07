import Base, { convertObjectToSnakeCaseKeys } from './base'
import ContextSituation from './contextSituation'
import Process from './process'

export default class InjectionMapping extends Base {
  constructor({ _id, process_id: processID, extension_area_id: extensionAreaID, injected_process: injectedProcess, context_situation: contextSituation }) {
    super()
    this.id = _id
    this.processID = processID
    this.extensionAreaID = extensionAreaID
    this.injectedProcess = injectedProcess ? new Process(injectedProcess) : undefined
    this.contextSituation = contextSituation ? new ContextSituation(contextSituation) : undefined
  }

  toJSON() {
    return {
      '_id': this.id,
      'process_id': this.processID,
      'extension_area_id': this.extensionAreaID,
      'injected_process': this.injectedProcess ? this.injectedProcess.toJSON() : undefined,
      'context_situation': this.contextSituation ? this.contextSituation.toJSON() : undefined
    }
  }

  static create(data) {
    // Call constructor, but with snake_case converted parameters
    const obj = new this(convertObjectToSnakeCaseKeys(data))
    obj.contextSituation = ContextSituation.create(data.contextSituation)
    obj.injectedProcess = Process.create(data.injectedProcess)
    return obj
  }
}
