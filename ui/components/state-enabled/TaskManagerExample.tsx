import React from 'react';
import { sComponent } from '../util/state.component';
import { StateInput } from './StateInput';
import { StateButton } from './StateButton';
import { StateModal } from './StateModal';
import { state } from '../util/state.component';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const TASK_STATE_KEY = 'tasks'; // Global key for task state
const FILTER_STATE_KEY = 'filter'; // Global key for filter state
const SELECTED_TASK_KEY = 'selectedTask'; // Global key for selected task

// Prepopulate tasks in the global state
state.setState({
    [TASK_STATE_KEY]: [
        { id: 1, text: 'Complete project documentation', completed: true },
        { id: 2, text: 'Review pull requests', completed: false },
        { id: 3, text: 'Prepare for the team meeting', completed: false },
    ],
    [FILTER_STATE_KEY]: 'all', // Default filter
    [SELECTED_TASK_KEY]: null, // No selected task initially
});

// TaskCounter Component
export class TaskCounter extends sComponent<{}> {
    componentDidMount() {
        this.__subscribeComponent(TASK_STATE_KEY);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(TASK_STATE_KEY);
    }

    render() {
        const tasks: Task[] = this.state[TASK_STATE_KEY] || [];
        const completedCount = tasks.filter((task) => task.completed).length;
        return (
            <div>
                <p>Total Tasks: {tasks.length}</p>
                <p>Completed: {completedCount}</p>
                <p>Incomplete: {tasks.length - completedCount}</p>
            </div>
        );
    }
}

// TaskFilter Component
export class TaskFilter extends sComponent<{}> {
    render() {
        return (
            <div>
                <button onClick={() => this.setState({ [FILTER_STATE_KEY]: 'all' })}>All</button>
                <button onClick={() => this.setState({ [FILTER_STATE_KEY]: 'completed' })}>Completed</button>
                <button onClick={() => this.setState({ [FILTER_STATE_KEY]: 'incomplete' })}>Incomplete</button>
            </div>
        );
    }
}

// TaskList Component
export class TaskList extends sComponent<{}> {
    componentDidMount() {
        this.__subscribeComponent(TASK_STATE_KEY);
        this.__subscribeComponent(FILTER_STATE_KEY);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(TASK_STATE_KEY);
        this.__unsubscribeComponent(FILTER_STATE_KEY);
    }

    render() {
        const tasks: Task[] = this.state[TASK_STATE_KEY] || [];
        const filter = this.state[FILTER_STATE_KEY] || 'all';

        const filteredTasks = tasks.filter((task) => {
            if (filter === 'completed') return task.completed;
            if (filter === 'incomplete') return !task.completed;
            return true;
        });

        return (
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        <span
                            style={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => this.setState({ [SELECTED_TASK_KEY]: task })}
                        >
                            {task.text}
                        </span>
                        <StateButton
                            stateKey={`${TASK_STATE_KEY}_${task.id}_completed`}
                            trueText="Mark Incomplete"
                            falseText="Mark Complete"
                        />
                    </li>
                ))}
            </ul>
        );
    }
}

// TaskInput Component
export class TaskInput extends sComponent<{}> {
    addTask = (text: string) => {
        const tasks: Task[] = this.state[TASK_STATE_KEY] || [];
        const newTask: Task = {
            id: Date.now(),
            text,
            completed: false,
        };
        this.setState({ [TASK_STATE_KEY]: [...tasks, newTask] });
    };

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const newTaskText = this.state.newTaskText || '';
            if (newTaskText.trim()) {
                this.addTask(newTaskText);
                this.setState({ newTaskText: '' });
            }
        }
    };

    render() {
        return (
            <div>
                <StateInput
                    stateKey="newTaskText"
                    placeholder="Enter new task"
                    onChange={(value) => this.setState({ newTaskText: value })}
                />
                <input
                    type="text"
                    placeholder="Hit Enter to add task"
                    value={this.state.newTaskText || ''}
                    onChange={(e) => this.setState({ newTaskText: e.target.value })}
                    onKeyDown={this.handleKeyDown} // Listen for Enter key
                />
            </div>
        );
    }
}

// TaskDetailsModal Component
export class TaskDetailsModal extends sComponent<{}> {
    componentDidMount() {
        this.__subscribeComponent(SELECTED_TASK_KEY);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(SELECTED_TASK_KEY);
    }

    render() {
        const selectedTask: Task = this.state[SELECTED_TASK_KEY];
        if (!selectedTask) return null;

        return (
            <StateModal
                stateKey="taskDetailsModal"
                title="Task Details"
                body={
                    <div>
                        <p>Task: {selectedTask.text}</p>
                        <p>Status: {selectedTask.completed ? 'Completed' : 'Incomplete'}</p>
                    </div>
                }
                onClose={() => this.setState({ [SELECTED_TASK_KEY]: null })}
            />
        );
    }
}

// Main App Component
const TaskManagerApp = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Task Manager</h1>
            <TaskCounter />
            <TaskFilter />
            <TaskInput />
            <TaskList />
            <TaskDetailsModal />
        </div>
    );
};

export default TaskManagerApp;
