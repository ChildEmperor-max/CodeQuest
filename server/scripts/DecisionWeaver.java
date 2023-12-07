public class DecisionWeaver {
    public static void main(String[] args) {
        // Declare and initialize variables
        int playerScore = 100;
        int highScore = 150;
        double temperature = 28.5;
        boolean isRaining = false;

        // Equality and Inequality
        System.out.println(" " + (playerScore == highScore));
        System.out.println("Is the player score not equal to the high score? " + (playerScore != highScore));

        // Less than and Greater than
        System.out.println("Is the temperature greater than 30 degrees? " + (temperature > 30.0));

        // Less than or equal to and Greater than or equal to
        System.out.println("Is the player score less than or equal to the high score? " + (playerScore <= highScore));
        System.out.println("Is the temperature greater than or equal to 25 degrees? " + (temperature >= 25.0));

        // Boolean comparison
        System.out.println("Is it raining? " + isRaining);
    }
}
