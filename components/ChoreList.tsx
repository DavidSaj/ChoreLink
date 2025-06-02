import React, { useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}




type ListName = { id: string; name: string };

type Chore = { id: string; task: string; deadline: string; score: number; details: string; listId: string };

export default function ChoreList({ listNames, chores }: { listNames: ListName[]; chores: Chore[] }) {
  const [expandedListIds, setExpandedListIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedListIds(prev =>
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: typeof chores[0] }) => (
    <View style={styles.taskRow}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.task}</Text>
        <Text style={styles.taskDeadline}>{item.deadline}</Text>
      </View>
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreText}>+{item.score}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {listNames.map(list => {
        const expanded = expandedListIds.includes(list.id);
        return (
          <View key={list.id} style={[styles.listBox, expanded && styles.listBoxExpanded]}>
            <TouchableOpacity onPress={() => toggleExpand(list.id)} activeOpacity={0.85}>
              <View style={styles.listHeader}>
                <Text style={styles.listName}>{list.name}</Text>
                <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {expanded && (
              <View style={styles.taskList}>
                <FlatList
                  data={chores.filter(chore => chore.listId === list.id)}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  listBox: {
    backgroundColor: '#f8f9fb',
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  listBoxExpanded: {
    backgroundColor: '#f0f4ff',
    borderColor: '#b3c7f7',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 22,
    backgroundColor: 'transparent',
  },
  listName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a2a',
    letterSpacing: 0.2,
  },
  chevron: {
    fontSize: 18,
    color: '#b3b3b3',
    marginLeft: 8,
  },
  taskList: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  taskDeadline: {
    fontSize: 13,
    color: '#7a7a7a',
  },
  scoreBadge: {
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3578e5',
  },
  separator: {
    height: 8,
  },
});