from src.generation import audio as tts_service


def test_get_cache_path_same_input_same_path(
    monkeypatch,
    tmp_path,
):
    monkeypatch.setattr(
        tts_service,
        "CACHE_DIR",
        str(tmp_path),
    )

    path1 = tts_service.get_cache_path(
        "Ahoj",
        "cz",
    )

    path2 = tts_service.get_cache_path(
        "Ahoj",
        "cz",
    )

    assert path1 == path2


def test_get_cache_path_normalizes_text(
    monkeypatch,
    tmp_path,
):
    monkeypatch.setattr(
        tts_service,
        "CACHE_DIR",
        str(tmp_path),
    )

    path1 = tts_service.get_cache_path(
        "Ahoj",
        "cz",
    )

    path2 = tts_service.get_cache_path(
        "  AHOJ  ",
        "cz",
    )

    assert path1 == path2


def test_get_cache_path_different_language_different_path(
    monkeypatch,
    tmp_path,
):
    monkeypatch.setattr(
        tts_service,
        "CACHE_DIR",
        str(tmp_path),
    )

    cz_path = tts_service.get_cache_path(
        "Hotel",
        "cz",
    )

    ua_path = tts_service.get_cache_path(
        "Hotel",
        "ua",
    )

    assert cz_path != ua_path


def test_save_cache(tmp_path):
    path = tmp_path / "test.mp3"

    data = b"fake audio bytes"

    tts_service.save_cache(
        str(path),
        data,
    )

    assert path.exists()
    assert path.read_bytes() == data


def test_is_cached_returns_true_for_existing_file(
    tmp_path,
):
    path = tmp_path / "test.mp3"
    path.write_bytes(b"audio")

    assert (
        tts_service.is_cached(str(path))
        is True
    )


def test_is_cached_returns_false_for_missing_file(
    tmp_path,
):
    path = tmp_path / "missing.mp3"

    assert (
        tts_service.is_cached(str(path))
        is False
    )


from unittest.mock import Mock


def test_tts_uses_cache_without_generating_audio(
    monkeypatch,
):
    fake_audio = Mock()

    monkeypatch.setattr(
        tts_service,
        "get_cache_path",
        lambda text, lang: "/fake/cache.mp3",
    )

    monkeypatch.setattr(
        tts_service,
        "is_cached",
        lambda path: True,
    )

    from_file_mock = Mock(
        return_value=fake_audio
    )

    monkeypatch.setattr(
        tts_service.AudioSegment,
        "from_file",
        from_file_mock,
    )

    generate_mock = Mock()

    monkeypatch.setattr(
        tts_service,
        "generate_audio_bytes",
        generate_mock,
    )

    result = tts_service.tts(
        text="Ahoj",
        voice_id="voice-1",
        lang="cz",
    )

    assert result is fake_audio

    generate_mock.assert_not_called()

    from_file_mock.assert_called_once_with(
        "/fake/cache.mp3",
        format="mp3",
    )


def test_tts_does_not_save_when_cache_disabled(
    monkeypatch,
):
    audio_bytes = b"fake mp3"

    monkeypatch.setattr(
        tts_service,
        "get_cache_path",
        lambda text, lang: "/fake/cache.mp3",
    )

    generate_mock = Mock(
        return_value=audio_bytes
    )

    monkeypatch.setattr(
        tts_service,
        "generate_audio_bytes",
        generate_mock,
    )

    save_mock = Mock()

    monkeypatch.setattr(
        tts_service,
        "save_cache",
        save_mock,
    )

    monkeypatch.setattr(
        tts_service.AudioSegment,
        "from_file",
        Mock(),
    )

    tts_service.tts(
        text="Тема: Минулий час",
        voice_id="voice-1",
        lang="ua",
        cache=False,
    )

    generate_mock.assert_called_once()

    save_mock.assert_not_called()


def test_tts_ignores_existing_cache_when_disabled(
    monkeypatch,
):
    monkeypatch.setattr(
        tts_service,
        "get_cache_path",
        lambda text, lang: "/fake/cache.mp3",
    )

    monkeypatch.setattr(
        tts_service,
        "is_cached",
        lambda path: True,
    )

    generate_mock = Mock(
        return_value=b"new audio"
    )

    monkeypatch.setattr(
        tts_service,
        "generate_audio_bytes",
        generate_mock,
    )

    monkeypatch.setattr(
        tts_service.AudioSegment,
        "from_file",
        Mock(),
    )

    tts_service.tts(
        "Тема",
        "voice-1",
        "ua",
        cache=False,
    )

    generate_mock.assert_called_once()

