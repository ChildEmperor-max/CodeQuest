public class DecisionCraftsman {
    public static void main(String[] args) {
        int playerScore = 100;
        boolean isBonusLevel = true;
        boolean hasPowerUp = false;

        System.out.println("Is the player in a bonus level with a power-up? " + (isBonusLevel && hasPowerUp));
        System.out.println("Is the player in a bonus level or has a power-up? " + (isBonusLevel || hasPowerUp));
        System.out.println("Is the player not in a bonus level? " + (!isBonusLevel));
    }
}
