import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { PollOption } from '@/features/posts/api/postsApi';

interface PollOptionsProps {
  options: PollOption[];
  totalVotes: number;
  votedOptionId?: string | null;
  onVote?: (optionId: string) => void;
  endsAt?: string;
}

export const PollOptions: React.FC<PollOptionsProps> = ({
  options,
  totalVotes,
  votedOptionId,
  onVote,
  endsAt,
}) => {
  const hasVoted = !!votedOptionId;
  const isPollEnded = endsAt ? new Date() > new Date(endsAt) : false;
  const showResults = hasVoted || isPollEnded;

  const getPercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const formatEndsAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs <= 0) return 'Ended';

    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 0) return `${diffDays}d left`;
    if (diffHours > 0) return `${diffHours}h left`;
    return 'Ending soon';
  };

  return (
    <View style={styles.container}>
      {options
        .sort((a, b) => a.order - b.order)
        .map(option => {
          const percentage = getPercentage(option.voteCount);
          const isSelected = votedOptionId === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                showResults && styles.resultOption,
              ]}
              onPress={() => !showResults && onVote?.(option.id)}
              disabled={showResults}
              activeOpacity={showResults ? 1 : 0.7}
            >
              {showResults && (
                <View
                  style={[
                    styles.progressBar,
                    { width: `${percentage}%` },
                    isSelected && styles.selectedProgressBar,
                  ]}
                />
              )}
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {option.text}
                </Text>
                {showResults && (
                  <Text
                    style={[
                      styles.percentageText,
                      isSelected && styles.selectedPercentageText,
                    ]}
                  >
                    {percentage}%
                  </Text>
                )}
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

      <View style={styles.footer}>
        <Text style={styles.votesText}>
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </Text>
        {endsAt && (
          <Text style={styles.endsAtText}>{formatEndsAt(endsAt)}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedOption: {
    borderColor: colors.primary,
  },
  resultOption: {
    backgroundColor: colors.background,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.primary + '15',
  },
  selectedProgressBar: {
    backgroundColor: colors.primary + '30',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: colors.primary,
  },
  percentageText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  selectedPercentageText: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  votesText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  endsAtText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
