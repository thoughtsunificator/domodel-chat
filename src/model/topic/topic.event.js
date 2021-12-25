import { EventListener } from "domodel"

/**
 * @global
 */
class TopicEventListener extends EventListener {

	/**
	 * @event TopicEventListener#topicChanged
	 * @property {string} topic
	 */
	topicChanged(topic) {
		this.identifier.topic.textContent = topic
		this.identifier.topic.title = topic
	}

}

export default TopicEventListener
