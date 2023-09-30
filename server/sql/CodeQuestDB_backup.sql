PGDMP     8    !                {         	   CodeQuest    15.3    15.3 1    =           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            >           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            @           1262    65737 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1255    65738    update_timestamp()    FUNCTION     �   CREATE FUNCTION public.update_timestamp() RETURNS trigger
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
       public          postgres    false            �            1259    65739    achievements    TABLE     �   CREATE TABLE public.achievements (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    description text NOT NULL,
    date_achieved timestamp without time zone
);
     DROP TABLE public.achievements;
       public         heap    postgres    false            �            1259    65744    achievements_id_seq    SEQUENCE     �   ALTER TABLE public.achievements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    214            �            1259    65745 	   character    TABLE     �   CREATE TABLE public."character" (
    character_name character(50),
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL,
    character_bio character(40),
    completed_quests text[]
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    65750    character_id_seq    SEQUENCE     �   ALTER TABLE public."character" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.character_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    216            �            1259    65751    dialog    TABLE     Q  CREATE TABLE public.dialog (
    id integer NOT NULL,
    dialog text,
    response_to integer[],
    npc_id integer,
    is_array boolean,
    stage text,
    quest_id integer,
    open_editor boolean,
    open_helper_id integer,
    dialog_branch integer,
    quest_hint_id integer,
    quest_status_required character varying(100)
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    65756    dialog_id_seq    SEQUENCE     v   CREATE SEQUENCE public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.dialog_id_seq;
       public          postgres    false            �            1259    65757    help    TABLE     �   CREATE TABLE public.help (
    id integer NOT NULL,
    title text,
    description text[],
    template text,
    one_line_highlight integer[],
    multi_line_highlight integer[]
);
    DROP TABLE public.help;
       public         heap    postgres    false            �            1259    65762    help_id_seq    SEQUENCE     �   ALTER TABLE public.help ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.help_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    65763    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character varying(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    65766 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222            �            1259    65770    playerQuests    TABLE     �   CREATE TABLE public."playerQuests" (
    player_id integer NOT NULL,
    quest_id integer,
    quest_status text,
    completion_date text
);
 "   DROP TABLE public."playerQuests";
       public         heap    postgres    false            �            1259    65775    playerQuests_player_id_seq    SEQUENCE     �   ALTER TABLE public."playerQuests" ALTER COLUMN player_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."playerQuests_player_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    224            �            1259    66047    players    TABLE     |  CREATE TABLE public.players (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    gender character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.players;
       public         heap    postgres    false            �            1259    66046    players_id_seq    SEQUENCE     �   CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.players_id_seq;
       public          postgres    false    229            A           0    0    players_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;
          public          postgres    false    228            �            1259    65777    quest    TABLE     A  CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character varying(100),
    quest_description text,
    quest_type text,
    quest_status text,
    code_template text,
    quest_answer text,
    required_quest_id integer[],
    pseudo_code text,
    hint text,
    script_name text,
    note text
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    65782    test_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    226            �           2604    66050 
   players id    DEFAULT     h   ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);
 9   ALTER TABLE public.players ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228    229            +          0    65739    achievements 
   TABLE DATA           T   COPY public.achievements (id, name, status, description, date_achieved) FROM stdin;
    public          postgres    false    214   �8       -          0    65745 	   character 
   TABLE DATA           x   COPY public."character" (character_name, level, experience, id, player_id, character_bio, completed_quests) FROM stdin;
    public          postgres    false    216   �9       /          0    65751    dialog 
   TABLE DATA           �   COPY public.dialog (id, dialog, response_to, npc_id, is_array, stage, quest_id, open_editor, open_helper_id, dialog_branch, quest_hint_id, quest_status_required) FROM stdin;
    public          postgres    false    218   :       1          0    65757    help 
   TABLE DATA           j   COPY public.help (id, title, description, template, one_line_highlight, multi_line_highlight) FROM stdin;
    public          postgres    false    220   �D       3          0    65763    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    222   �I       5          0    65770    playerQuests 
   TABLE DATA           \   COPY public."playerQuests" (player_id, quest_id, quest_status, completion_date) FROM stdin;
    public          postgres    false    224   �I       :          0    66047    players 
   TABLE DATA           q   COPY public.players (id, "firstName", "lastName", email, password, gender, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    229   J       7          0    65777    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_type, quest_status, code_template, quest_answer, required_quest_id, pseudo_code, hint, script_name, note) FROM stdin;
    public          postgres    false    226   �J       B           0    0    achievements_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.achievements_id_seq', 7, true);
          public          postgres    false    215            C           0    0    character_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.character_id_seq', 1, true);
          public          postgres    false    217            D           0    0    dialog_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.dialog_id_seq', 13, false);
          public          postgres    false    219            E           0    0    help_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.help_id_seq', 2, true);
          public          postgres    false    221            F           0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 3, true);
          public          postgres    false    223            G           0    0    playerQuests_player_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."playerQuests_player_id_seq"', 1, false);
          public          postgres    false    225            H           0    0    players_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.players_id_seq', 1, true);
          public          postgres    false    228            I           0    0    test_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.test_id_seq', 4, true);
          public          postgres    false    227            �           2606    65784    achievements achievements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.achievements DROP CONSTRAINT achievements_pkey;
       public            postgres    false    214            �           2606    65786    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    216            �           2606    65788    dialog dialog_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.dialog
    ADD CONSTRAINT dialog_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.dialog DROP CONSTRAINT dialog_pkey;
       public            postgres    false    218            �           2606    65790    help help_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.help
    ADD CONSTRAINT help_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.help DROP CONSTRAINT help_pkey;
       public            postgres    false    220            �           2606    65792    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    222            �           2606    65794    playerQuests playerQuests_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public."playerQuests"
    ADD CONSTRAINT "playerQuests_pkey" PRIMARY KEY (player_id);
 L   ALTER TABLE ONLY public."playerQuests" DROP CONSTRAINT "playerQuests_pkey";
       public            postgres    false    224            �           2606    66056    players players_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_email_key UNIQUE (email);
 C   ALTER TABLE ONLY public.players DROP CONSTRAINT players_email_key;
       public            postgres    false    229            �           2606    66054    players players_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.players DROP CONSTRAINT players_pkey;
       public            postgres    false    229            �           2606    65798    quest test_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.quest DROP CONSTRAINT test_pkey;
       public            postgres    false    226            �           2620    65799 %   achievements update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 >   DROP TRIGGER update_timestamp_trigger ON public.achievements;
       public          postgres    false    214    230            +   �   x�eO�N�@<�~���F�>��{%� >��*qi�UV�xU��$i� �e�#�g�)�Q����pw_��3ǘ��r�T�/��ԕ�aJ%�O 	��Ц�޿�6vW�]���غA��Դj�V����a����������56�UY"z�ڮ'�7��gx������	�x�n�ܒ©ϣ,!���S8p�)���\�8��`����Z�h      -   #   x��I�L-2T pr �!g�q��qqq �

�      /   �
  x��Xko7�,�
�_�(Bm����nиM�n�EPl05C�X͐
ɑ���{���h�.��1"9�q����ɿLQ[g&_��cr6�����<�<:;���l�R���Χ�	*��L~u3��jc�ZW�4����i�uQ��XjW�r��mR;���`�q�Qǭ�Wau2�r�X�g'�/g�t&W~m���W����]�;?�.&7���''�+MX����N*�DZ�t�.wj��V鹇�?荞���/fA/�FŤCRt�w|sf����F�����"��Vkk�_(�pF���N56F�*�(G����ԇ��EK]��Z����h���z�0�?��ٓɻW7Wo������(�:�Q��?��������;��}�H�Zj� �d�Wt�Z�F]��� �Wa�K
��+Q�.�����4�V'`�.�:�/n�L@~űK�1�V��5;U2�8r|t�0�k���>;y����5MZNÐ'�L�t���NmmZZ���'M�E�6���ϖ@3(�b!�(�%�7fIx\g�ub�V\/�lC�i�JT�,�����v��+�0�م���w�JKM�%����q�C]¥l��X7��R��S[��A޼��~"87�"f+t�Ѻ�[Z�Ӳ�PX'���(����l�s� ��@bԢ�lj�x����5�7p��|^c��Ш��8�'�/ۜ���\�(��b�&R�wj�:z�1G�NN��SU��?VW!W`:���]$
_�K�u��|��2���J��Q��|l-���+vk�Q����yZ�r����!���R��o���A��Fq�X�UаQ�"�F���D�#�W�j�n��d��1��|�:�z�B��'�u� |@�Ƈ���<��_-}]b�*�F�R4E`ehbOj%��,}�h�޳�dA�5s_��p������� #�U�i�6��~KhL�Md�U�8������[���xu,����3����is���V�4��b�~�\w :�D� :{:��y���_�����k��D�U�Wd~�*!x7U����;�������T�D��r�A-T��r3Cu�_o��0�}�3<��b �\mWF�����~��v��d��Mt� �6yr�]��x:�UT ���̛ ��D��A�bXDC��#���Kw"7Xגؓ��$��=��Ю�2d?@���6Yb�^���De�<�����"�;����ȼ�G6&w�I7�ڼ�zN~X��O��D��I��!
�;�P��7���q�r�i�%Db3����Eh���H����B�t	��;��X��G�^ !,(��`����}��H�443���5� �h�9%5�-�	�@i��^]58VʙGv`�t�Hb'E�cG�$Ee��i {]y.�X��}u*������8k'#2Gl�Vq����Z���]vCQ<f5�)1�V`F�O6
�:^iteJE�V��zi�SrX��!E[� 9������7^y��<�3�@p���Q�%�Tz����#	��j�֡d�8�Ew$�
�ֱy�
9u�-O����ͫ�w7�TxWb�C�e�)�B��ƛ[d ���)u�?(�^S�����
�C��E�ĵ�� �[ۅ`���V?���1���f�/����ۏ�j耀�G���(yT$��g%�>{-�D�KF�?�����w�Ԓ��9[F'H��\� �R�(��u|<Tڥ��ᬌY�v��e���b0R�Bұ-�Ȏ;�46'�=��`��5�.'ĈG����2g-��ԋI���h�� �D���G��8O`Ü�����5A�Y`��E���;=�sSY�$����Lj���֡�f���*��k �8h�,�e�~Z�=��=e���+66󩰒#�E��.����Cᓧ~F����s�������9����,^��#M�F֌�TF�s� !%^�ꀏ�J�*�f�s����~ҝ�W�4Z�ܸW�I�3���n݁E�d�a��l��G�3򓃢M�}6A�4&v�a��b�'�+�����5	�)�֮j�X�=��`�SY��(j0R4�&E��@?��1Ë��vA����>橄���A���lyv��O�S�S]!�i����>[�k8���W]bV�m4�C�nmd��z�u���2�a�w��o&���h���m�P��~f-j��(�[�G�qh���d?1���q.�)63):V�PH���t��p��1g/�7r"@NB�c��\1���&�>��Z(���M2fz=���H�G�nys��d��E`�<��o��P'c���ٔ��U�Eُ��r�5�+u�w����r�ˏ�M�����-G`���i�Hy!�32�ggΣ�9�%�mf��}=��2�ę����,��u�E� ���I��1�^qZ΢��e~�5��m��˄��l�VPt+Fv�ͻ� L�Q��։��8t#�R�~l}��#������_���Ň]��>CT/���. �f�?���t�9�#L�E֕=>�=V��վ�:cm:��d��}z{Z�81�J���+��d&�b�F:�H�d�޺\aRnR[�����`w5��w֙w�K4��fO{^��O�.�]��	sk�'r�]�=���y� v�#(�rr�~�,[˝Z!b!���+�t"oѺ<�+���t�,7ɾ"�V_��;�K� ����U�2@.�SUnH���ο�Ծ�a��N�]���ƐX���j_��Pe�Ɍp>��?�|��Z;���;z��b�v5���`�A��mvtt��+x�      1   �  x��V�n�6}N���K@�n{���:]�!�0%]˄)R%)+J�﹤쨎���D"/�=��C�:�|�&�]�[�L�����q���hH�}��2"�Iҫ���W��;�I��A+j�l'|�.P�ϲ�܈��VfG6zl,m�HS�(����>V@�Jy�v�]6��#2����s��V
U���t�5�ҴֵT*�џ���7b��}& q�;���#��|���䆰��m��Nu��RK����^o�#��	��
�Qj�:�F��Ǒ�`.���(��ȅ�Uhٍ��C�%�&�BWK�(��#}����E�3�QA����ܵ��N6,�'>?����*�̲���	~��P\�&��w����LgL�g	��v�c����ocl���Z�ë�#����֟��2(k<?�%�� Zr8+6��`gQ��K��-��er�2pg�`�.�}�P�_+���Tx5�˸��@~��rK�r]A�nTlz�cx�z�pƞ�|���h�e9�vqo�EQ����@�<#8��
���D|`�Љ�>X7�v�ɰf�A���676-�9=��ɒ�6#�hl4��]�x����,*�b�P�!X�o=��W1�U���L�Z���C�4+qH&��L�,�h��.>éz���"�k�g�qf��v�2��yr^so�Øy=q��=��PO�#,,Um�#�_a�~m���q\l�����r��?G�8����i���<�<��^g�d�f�=�,�O_��)�=qe,�B���c`���
>������;d�b��2ؓ��e%4��2s��χ8ؑ��HKD.���	��W�u�˗؞������ ����|�-�������m�dt3�%O���,@�6%���2�wB<.�ҕ�����X�7(��Χ!�A��ȹ��1�f�gl���?�t�Ҥ����:���H,,3�q�J���?�'�#��%_�o�}U����$C���s>g{� L��昅�s!q��!g�O�s�����	��~���:~H`<�FcҠ���&�<�:R�jO�]�N�9�L�~��\|�#R�/<��PS��^A0���۰��4�+'�e㗥x&3GA�\��SƄ]h�c�n��#��v�W����a\WH����yJ��́��;Mm�ݟi>��ML�E~zz�5w�/      3   4   x�3�N�-�I�p6�� .cNǜ�JǘӐ���$f�i����� �\      5      x������ � �      :   �   x�3�JLɩ���Hʬ��I-���d�A�s3s���s9U��TT|��3�"�JS�,�
|�s�=���*]C�R=��Ms������3����ӫ�C*B�9S����8���u,u�,ͭ��L-�,L�,p�p��qqq Gc2�      7   I  x��U�k�0���G��-m��}��l�����ƘU�K,�%O�B���;�Nۤ5c�%���w�W�":����2����Bz-o1�W"В��V�Q/P4��%�F� ����p[X�_7���X8�����\�t������n������w�[de������G�/�D1]�G/ŷ5�S���k���k��"Hz��Ƨh�SR4�'�D�
�[:c�|�'4�:;{�ё�d�w�%D�2�X!x��7���+�@m8M�ǀ�D �x��yb�|K[j�� F���X���ĵq��x=�4-]������w�!�P�=���I�4�W�t �-v�7�=��Ƣ�q�'��np�����kK����S�Z��W�i�ٽfF����1ńRƈM�`�]��d��3&�7I�E��*�FҨɐ�2*����?%�7Y��,xEp���3⮰��'ό?3~���4ist'�v>٬{�U���h2nN	���VG�ʕz^E�l)�z��4�ͽ�!��H��*�Ъ�f-�#Sݬң+��`�g�$��Ov�
KT}Db?���ImjQ�'%ʔ�&�Lj��Sp ����F.��s�������I��N_8��G�H���Kg�3���{C��ta�O��O��������χ�χ�����q�F*�����W�J\�@�͓Em�AW�.�{M�L�Cc�
�Jz*�l��	xD;a�?薱HV�����d�ގ��˘}��[V��6�V��G�������R���5�����]�(��\:`]�N��cX��z�C��}P�$v�5N%%ѩ�2�=��h�Q+b�"��K�U���o���+�1kF˧��|��ب��F�?
(��     