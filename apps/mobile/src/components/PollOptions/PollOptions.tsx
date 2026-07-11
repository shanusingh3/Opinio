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
        .map((option, index) => {
          const percentage = getPercentage(option.voteCount);
          const isSelected = votedOptionId === option.id;
          const isWinning = showResults && percentage === Math.max(...options.map(o => getPercentage(o.voteCount)));

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                showResults && styles.resultOption,
                !showResults && styles.votableOption,
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
                    isWinning && !isSelected && styles.winningProgressBar,
                  ]}
                />
              )}
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  {!showResults && (
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  )}
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                      isWinning && styles.winningOptionText,
                    ]}
                    numberOfLines={2}
                  >
                    {option.text}
                  </Text>
                </View>
                {showResults && (
                  <View style={styles.percentageContainer}>
                    <Text
                      style={[
                        styles.percentageText,
                        isSelected && styles.selectedPercentageText,
                        isWinning && styles.winningPercentageText,
                      ]}
                    >
                      {percentage}%
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.votesIcon}>👥</Text>
          <Text style={styles.votesText}>
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </Text>
        </View>
        {endsAt && (
          <View style={styles.footerRight}>
            <Text style={styles.clockIcon}>⏱️</Text>
            <Text style={styles.endsAtText}>{formatEndsAt(endsAt)}</Text>
          </View>
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
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface,
  },
  votableOption: {
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  selectedOption: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  resultOption: {
    backgroundColor: colors.surface,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.primary + '12',
    borderRadius: 10,
  },
  selectedProgressBar: {
    backgroundColor: colors.primary + '25',
  },
  winningProgressBar: {
    backgroundColor: colors.success + '15',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.md,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: colors.primary,
  },
  winningOptionText: {
    fontWeight: '600',
    color: colors.success,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 45,
    textAlign: 'right',
  },
  selectedPercentageText: {
    color: colors.primary,
    fontWeight: '700',
  },
  winningPercentageText: {
    color: colors.success,
    fontWeight: '700',
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votesIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  clockIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  votesText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  endsAtText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
