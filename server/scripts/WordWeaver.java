public class WordWeaver {
    public static void main(String[] args) {
        String adjective = "Amazing";
        String noun = "adventure";
        String sentence;

        sentence = "Embark on an " + adjective + " " + noun + " in the world of coding.";

        System.out.println(sentence);

        int sentenceLength = sentence.length();
        System.out.println("Sentence length: " + sentenceLength);

        String adventurePart = sentence.substring(17, 26);
        System.out.println("Adventure part: " + adventurePart);
    }
}

