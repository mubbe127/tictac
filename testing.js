function createUser (name) {
    const discordName = "@" + name;
  
    let reputation = 0;
    const getReputation = () => reputation;
    const giveReputation = () => reputation++;
  
    return { name, discordName, getReputation, giveReputation };
  }
  
  const josh = createUser("josh");
  josh.giveReputation();
  josh.giveReputation();
  
  console.log({
    discordName: josh.discordName,
    reputation: josh.getReputation()
  });


function createPlayer (name, level) {
    const { getReputation, giveReputation } = createUser(name);
  
    const increaseLevel = () => level++;
    return {getReputation, giveReputation, increaseLevel };
}


const hej = createPlayer("hej")

console.log(hej)