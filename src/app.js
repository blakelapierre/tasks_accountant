import { h, render } from 'preact-cycle';

import annyang from 'annyang';

let inited = false;

function init(mutation) {
  inited = true;

  const rootCommands = {
    'test': () => alert('test!'),
    'new task': (...args) => {
      respond('New Task');
      mutation(NEW_TASK)(...args);
      annyang.removeCommands(rootCommands);
      annyang.addCommands(newTaskCommands);
    }
  };

  const newTaskCommands = {
    '*other': (...args) => {
      respond(args.join(' '));
      mutation(NEW_TASK_TEXT)(...args);
      annyang.removeCommands(newTaskCommands);
      annyang.addCommands(rootCommands);
    }
  };

  annyang.addCommands(rootCommands);

  annyang.start();
}

const NEW_TASK = _ => {
  if (_.tracker.items.length > 0) {
    _.tracker.items[0].end = new Date().getTime();
  }

  _.tracker.items.unshift(new Task(''));
  return _;
};

class TObject {
  constructor() {
    this.time = new Date().getTime();
  }
}

class Task extends TObject {
  constructor(text) {
    super();
    this.text = text;
  }
}

const NEW_TASK_TEXT = (_, text) => {
  _.tracker.items[0].text = text;
  return _;
};

const fromEvent = (prev, event) => event.target.value;


const Tracker = ({tracker: {items}}, {mutation}) => (
  // jshint ignore:start
  <tracker>
    {!inited ? init(mutation) : undefined}
    {items.map(item => <item>{item.text} {new Date(item.time).toString()} {item.end ? new Date(item.end).toString() : undefined} {item.end ? (item.end - item.time) / 1000 + 's' : undefined}</item>)}
  </tracker>
  // jshint ignore:end
);

render(
  // jshint ignore:start
  Tracker, {
    tracker: {
      items: [],
      inputText: ''
    }
  }, document.body
  // jshint ignore:end
);

function respond(...args) {
  const utterance = new SpeechSynthesisUtterance(...args);
  window.speechSynthesis.speak(utterance);
  console.log('Responded: ', ...args);
}
