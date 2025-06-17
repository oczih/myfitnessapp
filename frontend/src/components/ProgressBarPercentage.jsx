
export const ProgressBarPercentage = ({ user }) => {
    if(!user){
        return;
    }
    const approvedCount = user.entries.filter(entry => entry.approved).length;
    const total = user.entries.length;
    console.log(user)
    if (total === 0) return 0;
  
    const percentage = ((approvedCount / total) * 100).toFixed();
    return Number(percentage);
  };