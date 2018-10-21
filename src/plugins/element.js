/* ============
 * ElementUI
 * ============
 *
 * This file installs ElementUI (https://element.eleme.io/)
 *
 * ElementUI is use as the UI Library. It provides out of the box components
 */

import Vue from 'vue'
import Element, { Loading, MessageBox, Notification, Message } from 'element-ui'
import '@/assets/styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/de'

Vue.use(Element, { locale })

Vue.$loading = Loading.service
Vue.$msgbox = MessageBox
Vue.$alert = MessageBox.alert
Vue.$confirm = MessageBox.confirm
Vue.$prompt = MessageBox.prompt
Vue.$notify = Notification
Vue.$message = Message
