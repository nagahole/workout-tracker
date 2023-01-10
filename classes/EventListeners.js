class SetNewPropsListener {
  constructor(){
    this.listeners = []

    this.subscribe = ({ id, cb }) => {
      this.listeners = [...this.listeners.filter((x)=> x.id !== id), { id, cb }]
    }

    this.unsubscribe = ({ id }) => {
      this.listeners = this.listeners.filter((x)=> x.id !== id)
    }

    this.propogate = (id, newProps) => {
      this.listeners.forEach((x)=> x.id === id && x.cb(newProps))
    }
  }
}

export const SetNewProps = new SetNewPropsListener()