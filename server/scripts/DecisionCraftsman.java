public class DecisionCraftsman {
    public static void main(String[] args) {
        // Declare and initialize variables
        int playerScore = 100;
        boolean isBonusLevel = true;
        boolean hasPowerUp = false;

        // Logical AND "Is the player in a bonus level with a power-up? "
        System.out.println("Is the player in a bonus level with a power-up? " + (isBonusLevel && hasPowerUp));

        // Logical OR "Is the player in a bonus level or has a power-up? "
        System.out.println("Is the player in a bonus level or has a power-up? " + (isBonusLevel || hasPowerUp));

        // Logical NOT "Is the player not in a bonus level? "
        System.out.println("Is the player not in a bonus level? " + (!isBonusLevel));
    }
}
