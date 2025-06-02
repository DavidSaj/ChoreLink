import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type CalendarTask = { color: string; task: string; time: string };

const sampleCalendarData: { date: Date; tasks: CalendarTask[] }[] = [
    {
        date: new Date(),
        tasks: [
            { color: '#6C63FF', task: 'Take out trash', time: '08:00' },
            { color: '#FF6584', task: 'Wash dishes', time: '12:30' },
            { color: '#FFD166', task: 'Laundry', time: '18:00' },
        ],
    },
    {
        date: new Date(Date.now() + 86400000 * 1),
        tasks: [
            { color: '#43D8C9', task: 'Vacuum', time: '09:00' },
            { color: '#3A86FF', task: 'Groceries', time: '11:00' },
        ],
    },
    {
        date: new Date(Date.now() + 86400000 * 2),
        tasks: [
            { color: '#FFBE0B', task: 'Feed cat', time: '07:30' },
            { color: '#6C63FF', task: 'Take out trash', time: '19:00' },
        ],
    },
    {
        date: new Date(Date.now() + 86400000 * 3),
        tasks: [{ color: '#FF6584', task: 'Wash dishes', time: '10:00' }],
    },
    {
        date: new Date(Date.now() + 86400000 * 4),
        tasks: [
            { color: '#43D8C9', task: 'Vacuum', time: '14:30' },
            { color: '#FFD166', task: 'Laundry', time: '16:00' },
            { color: '#3A86FF', task: 'Groceries', time: '17:00' },
        ],
    },
    {
        date: new Date(Date.now() + 86400000 * 5),
        tasks: [{ color: '#FFBE0B', task: 'Feed cat', time: '07:30' }],
    },
];

// Helper to format date as "Mon 3.6"
function formatDate(date: Date) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${dayNames[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}`;
}

// Helper to sort tasks by time
function sortTasksByTime(tasks: CalendarTask[]) {
    return tasks.slice().sort((a, b) => a.time.localeCompare(b.time));
}

const SQUARE_SIZE = 54;
const GAP_SIZE = 16;
const GRID_COLOR = '#222';

export default function CalendarComp() {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 32 }}
            horizontal={false}
        >
            {sampleCalendarData.map((day, idx) => (
                <React.Fragment key={idx}>
                    {/* Row */}
                    <View style={styles.row}>
                        {/* Date square */}
                        <View style={styles.gridSquareDate}>
                            <Text style={styles.dateText}>{formatDate(day.date)}</Text>
                        </View>
                        {/* Gap between date and tasks */}
                        <View style={{ width: GAP_SIZE }} />
                        {/* Task squares */}
                        <View style={styles.tasksCol}>
                            {sortTasksByTime(day.tasks).map((taskObj: CalendarTask, tIdx) => (
                                <View
                                    key={tIdx}
                                    style={[
                                        styles.gridSquareTask,
                                        { backgroundColor: taskObj.color }
                                    ]}
                                >
                                    <Text style={styles.taskText}>{taskObj.task}</Text>
                                    <Text style={styles.timeText}>{taskObj.time}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    {/* Horizontal gap + line between rows, except after last row */}
                    {idx < sampleCalendarData.length - 1 && (
                        <View style={styles.rowGapWithLine}>
                            <View style={styles.horizontalLine} />
                        </View>
                    )}
                </React.Fragment>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 22,
        backgroundColor: '#f7f8fa',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gridSquareDate: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // No borderBottomWidth here!
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#444',
        letterSpacing: 0.2,
        textAlign: 'center',
    },
    tasksCol: {
        flexDirection: 'row',
        flex: 1,
    },
    gridSquareTask: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        // No borderBottomWidth here!
        borderRadius: 6,
        marginRight: 0,
    },
    rowGapWithLine: {
        height: GAP_SIZE,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    horizontalLine: {
        height: 1,
        backgroundColor: GRID_COLOR,
        opacity: 0.15,
        marginLeft: 0,
        marginRight: 0,
    },
    taskText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 2,
        textAlign: 'center',
    },
    timeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '400',
        opacity: 0.9,
        textAlign: 'center',
    },
});