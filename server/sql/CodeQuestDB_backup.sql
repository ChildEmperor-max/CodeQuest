PGDMP     '    *                {         	   CodeQuest    15.3    15.3     "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
    quest_id integer
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
   TABLE DATA           d   COPY public.dialog (id, dialog, response_to, npc_id, branch, is_array, stage, quest_id) FROM stdin;
    public          postgres    false    222   �#                 0    41278    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    217   +                 0    41282    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    219   G+                 0    41285    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, code_template, quest_answer, required_quest_id, dialog_id) FROM stdin;
    public          postgres    false    220   d+       &           0    0    achievements_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.achievements_id_seq', 7, true);
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
       public          postgres    false    214    223               �   x�eO�N�@<�~���F�>��{%� >��*qi�UV�xU��$i� �e�#�g�)�Q����pw_��3ǘ��r�T�/��ԕ�aJ%�O 	��Ц�޿�6vW�]���غA��Դj�V����a����������56�UY"z�ڮ'�7��gx������	�x�n�ܒ©ϣ,!���S8p�)���\�8��`����Z�h            x������ � �         :  x��W�o�F�,�#}�Y��m�%���Z_�0���W�ڊ���.-���}3KҒ좀���x3�ޛ��'����/���o������ֿ���dv�]�a��SZ%��M����ԁMy���{2k�%��y0���9�y�Ӟ)&�.����@�W���$�l$����Z.������I�;jl��Ut%wr���mmM]ӊ
�/�Tt��N}7�|~u��ɍ���m����c�|���dy�p������������yz(�n� ��y���a�JB�<�����]]]�~
��N�ϏxA���s]{��.�3�4l���7ܶheg���m�+�^���j��3�דU>�M�_��_^,_On��Cc]��l3�}�}Yw�n*\?�`l�%_KV�����"�2�Nbo�Le�#��t\��J 	b���A�*0'DOJ�x���$F�#�\)^��4tS��8���h��n�R�C�m�L+9����6�i������	�jA;W�b�éJ�%�l���i)Q�n�鹸+���s�Lj���:_��@{+4�4P�`��,�d<�"K"%~��'�a�V��3n�;���F4&�~��M�UR�uq@�Lp]���ٱ�A.�!�kfw��ʈnO���q��}a0Bʰp�M6~lk��SW$��y|���xu�T+�PQ�c/�A(��ĝ�1X���	�N�Ys¾\��v��(m��=��܌���ī�*�</���/Zhh&&w\��e�90��g�����Y����7�jab}(���������+�RjQR��Y�L�Öߜx4
~)��ǈG�AifI��E²�����}�Z���� �Q������p�5�dc[��}λ���`+d�����ןdq���rW��A�����>jW0�mD��T��gWq��*@cȨ�.��lҍO��8�9�p	�ܬM�A�(^a�lr^�Q�BYq�������n���l
��� ��m��8�$ U�Rt��qb���V��"(�z�0R-��R-vqz̮�7�7�Jk-˦�;�^��gT�C��P�3�z?�v��E����ĝ�T�p
{H�;��G	����p
�*A�e!=��(`9�1������sY< ���+���b���^��ǵqUg*�k�V�)�Ŀ:i�A�������Cv��鵰6�13MV��c9�拸��須�S���J�i#X5�jsq�j����Ԣ>#��C�إ��]��R��.��!Xײ���}G�;�������{z
Z<�G���~-fw/j�.(�Z�����*̫;�q�v(J�g$tƾ&��S��T:��D��o�nQ�Pg���0�D�z�����h�2I%q=OrU>�%/SY�t��m$�|)�"���u
Ñ�v3�,�(+�����P>j����p�#�W�$��T���j^ھ���9<eA�L��Y�nh'��6�"�)�g&�g�H��k��)�TV�-;�2iX����@y��8�w��b7(K>Eu�w�1ָq4Tf2O���^�r� ���]:C穙�fR��lphF�[�2�c,����Sa�'|8��*!�$Pq6{D��~��h�k�!���gӕ��'���l%?r�I;ޟ�F٤`o��n�G,�X�R�/���
UI��j�HZ�#?Mjǻ�`�mR�T,��_�:���.a*��o,f��	�.~��Yp��C���j���|�eQzYP�$�����^�����=������qbSl�딣�}�y�6'������0|F���V�>5��/�$��=���sX���5l�2��^� ��2�:j�������_|}         4   x�3�N�-�I�p6�� .C��!HȐӂ˘�1'��3�4����� ��Y            x������ � �         P  x���Mk�0��ίPsja��6Ʈ�e�����&Zkp�`+)e��O��>X��1ȱd�y%�Ջ�Fo-�t8�ƖptvA���v�.�Z��!�k�7���M�*�U�l�)��:�75�gN kp�,�u��J���������l���?�r:�!h���ޫ�Yvr'~���uFvߌA1�����IIWA��E�\�'b��F8�J�����(�pM-���
Q#�Ko���oM�Ab��~�:�*sg�@��M��#�ߟ����آ[���F�D� ���!=�i�����h��nx�I9�f�;��L��hרɏ�<K���N%/     