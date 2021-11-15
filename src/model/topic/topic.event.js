import { EventListener } from "domodel"

/**
 * @global
 */
class TopicEventListener extends EventListener {

	/**
	 * @event TopicEventListener#topicShow
	 */
	topicShow() {
		this.identifier.topic.style.display = "block"
	}

	/**
	 * @event TopicEventListener#topicHide
	 */
	topicHide() {
		this.identifier.topic.style.display = "none"
	}

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
