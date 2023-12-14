public class TypeCastingAdventure {
    public static void main(String[] args) {
        int myAge = 25;
        double myDoubleValue = 3.75;

        double myNewDouble = myAge;
        int myIntValue = (int) myDoubleValue;
        
        System.out.println("Implicit Casting: " + myNewDouble);
        System.out.println("Explicit Casting: " + myIntValue);

    }
}
