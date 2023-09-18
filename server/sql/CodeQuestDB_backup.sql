PGDMP     (    .                {         	   CodeQuest    15.3    15.3     "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            #           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            $           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            %           1262    41259 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1255    41260    update_timestamp()    FUNCTION     �   CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status = 'unlocked' THEN
    NEW.date_achieved := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;
 )   DROP FUNCTION public.update_timestamp();
       public          postgres    false            �            1259    41261    achievements    TABLE     �   CREATE TABLE public.achievements (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    description text NOT NULL,
    date_achieved timestamp without time zone
);
     DROP TABLE public.achievements;
       public         heap    postgres    false            �            1259    41266    achievements_id_seq    SEQUENCE     �   ALTER TABLE public.achievements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    214            �            1259    41267 	   character    TABLE       CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL,
    character_bio character(40),
    completed_quests text[]
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    49431    dialog    TABLE     �   CREATE TABLE public.dialog (
    id integer NOT NULL,
    dialog text,
    response_to integer[],
    npc_id integer,
    branch integer,
    is_array boolean,
    stage text,
    quest_id integer,
    open_editor boolean,
    quest_hint text
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    41278    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character varying(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    41281 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    41282    player    TABLE     
  CREATE TABLE public.player (
    first_name character(100) NOT NULL,
    last_name character(100) NOT NULL,
    email character(100) NOT NULL,
    password character(100) NOT NULL,
    gender "char" NOT NULL,
    created_at date NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.player;
       public         heap    postgres    false            �            1259    41285    quest    TABLE     T  CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character varying(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character varying(100) NOT NULL,
    quest_type character varying(100) NOT NULL,
    code_template text,
    quest_answer text,
    required_quest_id integer,
    dialog_id integer
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    41290    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220                      0    41261    achievements 
   TABLE DATA           T   COPY public.achievements (id, name, status, description, date_achieved) FROM stdin;
    public          postgres    false    214   �"                 0    41267 	   character 
   TABLE DATA           x   COPY public."character" (character_name, level, experience, id, player_id, character_bio, completed_quests) FROM stdin;
    public          postgres    false    216   �#                 0    49431    dialog 
   TABLE DATA           }   COPY public.dialog (id, dialog, response_to, npc_id, branch, is_array, stage, quest_id, open_editor, quest_hint) FROM stdin;
    public          postgres    false    222    $                 0    41278    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    217   �+                 0    41282    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    219   �+                 0    41285    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, code_template, quest_answer, required_quest_id, dialog_id) FROM stdin;
    public          postgres    false    220   �+       &           0    0    achievements_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.achievements_id_seq', 7, true);
          public          postgres    false    215            '           0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 3, true);
          public          postgres    false    218            (           0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 4, true);
          public          postgres    false    221            }           2606    41292    achievements achievements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.achievements DROP CONSTRAINT achievements_pkey;
       public            postgres    false    214                       2606    41294    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    216            �           2606    41298    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    217            �           2606    41300    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    219            �           2606    41302    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    220            �           2606    49437    dialog test_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.dialog
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.dialog DROP CONSTRAINT test_pkey;
       public            postgres    false    222            �           2620    41303 %   achievements update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 >   DROP TRIGGER update_timestamp_trigger ON public.achievements;
       public          postgres    false    214    223               �   x�eO�N�@<�~���F�>��{%� >��*qi�UV�xU��$i� �e�#�g�)�Q����pw_��3ǘ��r�T�/��ԕ�aJ%�O 	��Ц�޿�6vW�]���غA��Դj�V����a����������56�UY"z�ڮ'�7��gx������	�x�n�ܒ©ϣ,!���S8p�)���\�8��`����Z�h            x������ � �         x  x��Wmo7�,���������~�áѵu{� F�0�;Z��%�H�e5��g��z��3d[����<������ѧ���j����sq5��Ͼ|5��zWrXu���"si�;2u`S�h�����w��e�͌n�vJK^���e�ɄD���8�Q��5�)�_&�;�"t�55��&�"�Gc����u���9���n��֦�iA����)]���M�LF�^>��w�km��ߎc}��q4�|������|4�m=탑ܺ[πmm�q�oX7 ��!L��`�d�M^�x1�=X'+~�J��h���ӭu9�P����v1q3�i�VV�n��ѥSp/ncv0����т*�Ȧ��'V������94֕��z=���}Yw�f,G^��_K��ٔ��"\6�F"�0��XGv%��Q�p����s������xB�ف�+��Ts9�Aش ��u���),# �]Y%&"�D؊�Yr���XmJ�&��v�5��j�;W�b�fG��[��W�4����	�`�L�j��s�L�X;_�jG[+T�TQ�`�a/�d<[#VRDZ.Ɋ�&�µTh�ʕ��L�W�!c�6��VI�W〨���.7[�a	��]�/���$H��j?)j�W�ۗCX�2,lz���ZE��ԕ;� /^�d?����j$�
�d�Ԡ�t�iP&��/�ԓs���.g�ǽ�!eC�.d�9)C��{z+�*F�^����'-44i<N��2�����lB�@�\Ī�����S�ٜ�N_M�9���ŷ�n��Rs�����
�l��7'Z
\�huE�1�Q��Z8��&��"�Y6��_vE�>r-~�U��(��)�zNC��(-��������OV��Ы�Nh8�?~������׎b��H16��B:��31�}2K�쫤�{�eN��CW;�=!.����	�(RXX���x���\)��Ki��*�8K��s����K[c#��q���9%�%vG�i�4t�V���/�U �*a�T��@���1�Nt*|�ε��b<����@h�F�H���|�Wo���١�P��H�N(�??��Fὸk�?~C�J� �2�N�Z�?��:�"�x���x*+x+<q�8�T�a�*�OD�6��L�S���!e��X'���d(��kz��g�K��k��i�-b&�X�7n��
���ϡNAO�X*n�2���V��Ck�	1N-R�3�C�
�]��Jm�;ܧKI�E>�v-k3l�
��4��Z5f���K�ǧ�Ewy�	|��{)�,�E��Q��m$D&?��
�ꎳ��҅�(���c�YjSŤTN��~E�tXs�"�2����'0׋4�������e�J�z�䬼�eI^4���A鮑�H��RExkۗ,�F����dbY�$��0�P��Q]�w'�@���p��$":�jT��ƥ�[��%�H��!
2��П�=ᆶ���^�Z�0���ĻL����z�2�ԁ�J�E`��L��+�2P���݁���5�R�OQ��M~���3��"�t�l�S�}J�*��x�{3�tȶ8��-k�`6���"Ta�'|���2!�$Pq�zx2�w~���K�"���Gӕ���C���l��F~࢓�=���I�^���l�X���B[lE�Z%�d�V��ASvTćq�x��l�N*��E;��P�{�m9��3�r�^��.��b�,��=�?ܠ9K���yp~?����:�_2J/� �ό���Ѵ��iM��4I��u s����k��:ب�j����6���t�l7�%��`b+���rt��I����`�Nn�Ҳ���)� %��]��q�A�E�آ' �bq���~�W�PD���@�|�.�A��~9X����/�a?�U���������� D�'         4   x�3�N�-�I�p6�� .C��!HȐӂ˘�1'��3�4����� ��Y            x������ � �         n  x���=O�0@g�W�Z	RѲ!��R��0P����Zr�Ⱦ��P�;�$-]X�eɖ}g���xV����(�~[_[;_C$���5�)Z�%�gM�s�8U�iPD�QT�ʚ
�b�XS|,��")��FC��̺�UX�׷�!:�n�_���6��@�y+O<���m�V�"3�?2FAi��cw�&u���V�$�k��^|��B�c
���`�C��Px� g�HX澦���Ⱥ�P^����j�t�à{?�ے����S��LB���`h"�k��.}�P��P����M��Ft��K��c�-]a��Q�_��,sq>ߣ<$U-�qW�d�U�B˚��vȿ��������ȳ,�g^=.     