public class WideningAdventure {
    public static void main(String[] args) {
        byte myByte = 5;
        short myShort = 200;
        int myInt = 1000;
        float myFloat = 3.14f;

        short widenedShort = myByte; 
        int widenedInt = myShort;    
        long widenedLong = myInt;    
        double widenedDouble = myFloat; 

        System.out.println(widenedShort);
        System.out.println(widenedInt);
        System.out.println(widenedLong);
        System.out.println(widenedDouble);
    }
}
