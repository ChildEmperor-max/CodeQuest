public class TypeCastingAdventure {
    public static void main(String[] args) {
        // Declare and initialize variables
        int myAge = 25;
        double myDoubleValue = 3.75;

        // Implicit type casting
        double myNewDouble = myAge; // Implicit casting from int to double

        // Explicit type casting
        int myIntValue = (int) myDoubleValue; // Explicit casting from double to int

        // Display the results
        System.out.println("Implicit Casting: " + myNewDouble);
        System.out.println("Explicit Casting: " + myIntValue);
    }
}
