PGDMP                         {         	   CodeQuest    15.3    15.3     "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
    open_editor boolean
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
   TABLE DATA           q   COPY public.dialog (id, dialog, response_to, npc_id, branch, is_array, stage, quest_id, open_editor) FROM stdin;
    public          postgres    false    222   �#                 0    41278    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    217   '+                 0    41282    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    219   k+                 0    41285    quest 
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
       public          postgres    false    214    223               �   x�eO�N�@<�~���F�>��{%� >��*qi�UV�xU��$i� �e�#�g�)�Q����pw_��3ǘ��r�T�/��ԕ�aJ%�O 	��Ц�޿�6vW�]���غA��Դj�V����a����������56�UY"z�ڮ'�7��gx������	�x�n�ܒ©ϣ,!���S8p�)���\�8��`����Z�h            x������ � �         8  x��W�o�F�,�#}�E�⤿��á�]����=�+rDmE��v��uA��{3KҔ�� ;1���73o�_�>r�}Z���~���\�����o���ޕv]=�M���D:��Lؔ':8$��]���G��;\Җw>0�b2!�����(��ӞÒ�_&�;�"t�55��&�#��1�zG��Ѻ�^�݁�ixE�{D{S״�B���%]��S���O�_��٭" ��d�O�1�>}�y���]���=n�������e��$���~H{���a=M�F3�<����Z�z�j�s�NN"����)��=׵�{�r��N����b�f��V����
a~�CKd���`Nx���%�7�U>�M+���L�j�fvǏ��/,z'og��/�8�妛g#Ʃ��kIy�Y�]D��>H*&S���$;� �KbZ�y�.�	��g�^=3tg#��j.��e6d���@a~
�H=jwVه|"��b�m���Miڤ�q �?­��s�/0kNT
e��
�i�h�O��s�7h(./�0�n�b�|���'C!�8_8�x�G��S�'�� ?2L�s{iÞ�;�9Ew4�~b��C�m:!��j��Y3�	t=n����� ��_l��Y�*#-}ֹ�W܍YN#�No���S[�lș���$�û���t�wQ��Z����_����N��;����wrϖ��j�eT*��@ahׅ,O5'�g<|O�%^ňv����"��������/�/c΁�<k#�	t��-�"����짓
��
��f�͙�ɟW�B�EjJ�&
�R�8������3G�E�����>ID-���hg����C��/���}�,�D>�S`�jP�EG�����e����=�dU��*�}K��g1�����:-~��F�V����8��pX�cl�.���T҃�k�{	\)7[�LT���49q2�PS\)�$J�К*�7+��s|D��z[[��8�3N�v�h4́�	 �o%����Q��oFJ��hMT]�O������[̦-b�������3��C��P��z?Nz�SC��ֶ�|�UOr�|��;M���@s����� ���+�_��,]��w^�&�]���m�'���b�T"�G���
��U��x��\7�|��d��Zx-�}E?f-�F6=�&�"f����\of�\D�7h[��8�|ᨄ��l�fY�-���#$8���ψrQ(v-����p���һ�<u��u�5���{Z�s�"��������sТ����~���4a����ڂ��Y��"��AL�{u�9N�Bi��㮄y�Ͻ�D��T)�P���O�Ã��=�-�*�����N�i35�C��J�LSI\ϓ\�� ɋ�T�%=4r	<_ʥHom�f��Ȋ�o�Ք�Jr��e�"����;s. u��jGIFtSլdS�K���a,���,Ⱥ�n�@���:�r�����aN����-����?e
i ��j����L���^(�t7G��VT�e�����.?��wB��L��>=([d_�|Jw�=���L*ݡ� ��w�Z},c��hU�*l������C%d*�*�HV��_����������t�������YzP6�S����d�/i�lR��*7�	w֡T�����B�$���ʤ�d�&~�Ϧ��`�}R�T,:�_����eZ�?�K��Dwݏsd��p��,��W�!�qY5:m�u���(�T�� ������'�����rR��:���Nl��Nc]iTAu�9ݿX�.�S�Fv>��`b+��Ce�i����~ o�:�>�y=|���r/}!�|�a��}uuu�?Ⰰt         4   x�3�N�-�I�p6�� .C��!HȐӂ˘�1'��3�4����� ��Y            x������ � �         n  x���=O�0@g�W�Z	RѲ!��R��0P����Zr�Ⱦ��P�;�$-]X�eɖ}g���xV����(�~[_[;_C$���5�)Z�%�gM�s�8U�iPD�QT�ʚ
�b�XS|,��")��FC��̺�UX�׷�!:�n�_���6��@�y+O<���m�V�"3�?2FAi��cw�&u���V�$�k��^|��B�c
���`�C��Px� g�HX澦���Ⱥ�P^����j�t�à{?�ے����S��LB���`h"�k��.}�P��P����M��Ft��K��c�-]a��Q�_��,sq>ߣ<$U-�qW�d�U�B˚��vȿ��������ȳ,�g^=.     