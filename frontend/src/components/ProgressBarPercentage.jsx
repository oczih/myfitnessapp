
export const ProgressBarPercentage = (props) => {
    if (!props || !props.user) {
        return 0;
    }

    const { user } = props;
    const approvedCount = user.entries.filter(entry => entry.approved).length;
    const total = user.entries.length;

    console.log(user);

    if (total === 0) return 0;

    const percentage = ((approvedCount / total) * 100).toFixed();
    return Number(percentage);
};